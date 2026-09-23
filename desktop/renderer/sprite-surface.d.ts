export interface SpritePaint {
  ok: boolean;
  kind: string;
  reason: string;
  src?: string;
  cached?: boolean;
  pending?: boolean;
}

export interface SpriteSurfaceModule {
  CSS: number;
  BOX: {
    host: number;
    sip: number;
    brick: number;
    called: number;
    plant: number;
    guest: number;
  };
  catalogFrame: (src: string) => boolean;
  paintHeld: (canvas: HTMLCanvasElement, src: string, opts?: { cssSize?: number }) => SpritePaint;
}

declare const api: SpriteSurfaceModule;
export default api;
