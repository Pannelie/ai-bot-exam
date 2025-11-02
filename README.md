Ny function:

I min "chains":

Steg 1: const answerSchema = z.object({ response: z.union([ z.string().min(1), z.object({ response: z.string().min(1), mainSource: z.string().nullable(), }), ]), });

Steg 2: const answerParser = StructuredOutputParser.fromZodSchema(answerSchema);

Steg 3: const conversationChain = new ConversationChain({ llm, prompt: answerTemplate, memory, outputParser: answerParser, });

#Jag valde StructuredOutputParser.fromZodSchema

Min LLM skickar alltid en sträng, och den vill jag konvertera till ett object för att lättare kunna sköta min navigering längre in i koden. Den baseras på min answerPrompt som ska leverera både response och den del av context som svaret baseras på "mainSource"

Min StructuredOutputParser tar emot min text inuti conversationsChain och konverterar om den till ett object. Detta baseras på ett zod schema som jag strukturerat upp (answerSchema). Om min text ser ut som JSON så blir det ett object med response och mainSource, men om det bara är en string så mappas den till enbart response.

Kodandet har strulat en hel del under denna punkt. Fungerade felfritt första omgången, men resterande så hakade den upp sig på mitt zod schema innan jag la till möjligheten att justera utifrån JSON utseende eller text.
