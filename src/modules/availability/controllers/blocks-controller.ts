import { BlockService } from "../services/blocks-service";
import { CreateBlockBody } from "../types";

export const BlockController = {
  getBlocks: BlockService.getBlocks,

  createBlock(body: CreateBlockBody) {
    return BlockService.createBlockFromBody(body);
  },

  deleteBlock(type: "day" | "slot", id: number) {
    return BlockService.deleteBlock(type, id);
  },
};
