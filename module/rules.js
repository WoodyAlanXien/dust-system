




// Function to download the file
async function downloadFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

// Function to extract content as HTML using Mammoth
async function extractContentAsHtml(buffer) {
    const result = await window.mammoth.convertToHtml({ arrayBuffer: buffer });
    return result.value;
}


// Function to split content into chapters
function splitIntoChapters(content) {
    const chapters = [];
    const chapterRegex = /(Chapter\s\d+:.*?)(?=Chapter\s\d+:|$)/gis;

    let match;
    while ((match = chapterRegex.exec(content)) !== null) {
        const chapterText = match[1].trim(); // Entire chapter, including title and content
        const title = chapterText.split(/[:\n]/)[0]; // Extract just "Chapter X: Title" (remove ": Content")
        chapters.push({ name: title, content: chapterText }); // Push both title and full HTML content
    }
    return chapters;
}


// Function to create journal entries in Foundry VTT
async function createJournalEntries(chapters) {
    for (const chapter of chapters) {
        // Create a base journal entry
        const journalEntry = await JournalEntry.create({
            name: chapter.name, // Title of the journal entry
            folder: null, // Optionally specify a folder
            ownership: { default: 1 } // Permissions: 1 allows all players to view
        });

        console.log(`Journal entry created: ${chapter.name}`);

        // Add a page to the journal entry
        await journalEntry.createEmbeddedDocuments("JournalEntryPage", [
            {
                name: "Content", // Title of the page
                text: {
                    content: chapter.content, // HTML content for this page
                    format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML // Ensure HTML format
                },
                type: "text", // Type of the page
                ownership: { default: 1 } // Permissions for the page
            }
        ]);

        console.log(`Page added to journal entry: ${chapter.name}`);
    }
}
