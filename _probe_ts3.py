ts=open("web/src/lib/pets/window-play.ts",encoding="utf-8").read()
i=ts.find("type WindowPlayKind")
# find end of that type (first semicolon after)
end=ts.find(";", i)
print(ts[end-800:end+1])
print("====PHASE====")
# find phase type with trumpet-on
i=ts.find('"trumpet-on"')
print(repr(ts[max(0,i-200):i+120]))
