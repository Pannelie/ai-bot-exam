export function combineDocuments(docs) {
  const context = docs.map((doc) => doc.pageContent).join("\n\n");
  const sources = docs.map((doc) => ({
    title: doc.metadata.title || "Okänd källa",
    anchorId: doc.metadata.anchorId || "",
    sectionNumber: doc.metadata.sectionNumber,
  }));
  return { context, sources };
}
