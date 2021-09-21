import {VisualPlayerCore} from "./index"
import * as Comlink from "comlink";

// class VisualPlayerWorker {
//   private visualPlayerCore?: VisualPlayerCore;
//
//   set player(player: VisualPlayerCore) {
//     this.visualPlayerCore = player;
//   }
//   get player(): VisualPlayerCore {
//     if (this.visualPlayerCore) {
//       return this.visualPlayerCore
//     } else {
//       throw new Error("You need to call the create() method before any other methods");
//     }
//   }
//
//   create(...args: ConstructorParameters<typeof VisualPlayerCore>) {
//     this.player = new VisualPlayerCore(...args)
//   }
// }
//
// const visualPlayerWorker = new VisualPlayerWorker()

Comlink.expose(VisualPlayerCore);
