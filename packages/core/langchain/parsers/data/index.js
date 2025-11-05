import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { answerSchema } from "@csbot/schemas";

export const answerParser = StructuredOutputParser.fromZodSchema(answerSchema);
