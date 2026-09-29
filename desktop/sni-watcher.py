#!/usr/bin/env python3
"""A small StatusNotifier watcher and host, for the first-run drive only (tray_appears_later_sni).

It owns org.kde.StatusNotifierWatcher on the session bus, says a host is there, keeps the items that
register (dropping one when its bus name goes away), and writes the live list as JSON to the file named
on the command line after each change. It shows nothing. Needs python3 with PyGObject (python3-gi).
"""
import json
import sys

import gi

gi.require_version("Gio", "2.0")
from gi.repository import Gio, GLib  # noqa: E402

XML = """<node><interface name="org.kde.StatusNotifierWatcher">
<method name="RegisterStatusNotifierItem"><arg type="s" direction="in"/></method>
<method name="RegisterStatusNotifierHost"><arg type="s" direction="in"/></method>
<property name="RegisteredStatusNotifierItems" type="as" access="read"/>
<property name="IsStatusNotifierHostRegistered" type="b" access="read"/>
<property name="ProtocolVersion" type="i" access="read"/>
<signal name="StatusNotifierItemRegistered"><arg type="s"/></signal>
<signal name="StatusNotifierItemUnregistered"><arg type="s"/></signal>
<signal name="StatusNotifierHostRegistered"/>
</interface></node>"""
PATH = "/StatusNotifierWatcher"
out = sys.argv[1] if len(sys.argv) > 1 else ""
items = {}  # "busname/path" -> owner bus name


def write():
    if out:
        with open(out, "w", encoding="utf-8") as f:
            json.dump(sorted(items), f)


def call(conn, sender, path, iface, method, params, inv):
    if method == "RegisterStatusNotifierItem":
        arg = params.unpack()[0]
        # An item gives its own bus name, or just an object path (then the sender is the bus name).
        key = f"{sender}{arg}" if arg.startswith("/") else (arg if "/" in arg else f"{arg}/StatusNotifierItem")
        owner = sender if arg.startswith("/") else arg.split("/")[0]
        items[key] = owner
        write()
        conn.emit_signal(None, PATH, "org.kde.StatusNotifierWatcher", "StatusNotifierItemRegistered", GLib.Variant("(s)", (key,)))
    inv.return_value(None)


def prop(conn, sender, path, iface, name):
    if name == "RegisteredStatusNotifierItems":
        return GLib.Variant("as", sorted(items))
    if name == "IsStatusNotifierHostRegistered":
        return GLib.Variant("b", True)
    return GLib.Variant("i", 0)


def gone(conn, sender, path, iface, signal, params):
    name, old, new = params.unpack()
    if new:
        return
    dead = [k for k, owner in items.items() if owner == name]
    for k in dead:
        del items[k]
    if dead:
        write()


def main():
    write()
    info = Gio.DBusNodeInfo.new_for_xml(XML).interfaces[0]
    loop = GLib.MainLoop()

    def on_bus(conn, name):
        conn.register_object(PATH, info, call, prop, None)
        conn.signal_subscribe("org.freedesktop.DBus", "org.freedesktop.DBus", "NameOwnerChanged", "/org/freedesktop/DBus", None, Gio.DBusSignalFlags.NONE, gone)

    Gio.bus_own_name(Gio.BusType.SESSION, "org.kde.StatusNotifierWatcher", Gio.BusNameOwnerFlags.NONE, on_bus, None, lambda *a: loop.quit())
    loop.run()


if __name__ == "__main__":
    main()
