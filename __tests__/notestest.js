describe('Basic user flow for Website', () => {
    beforeAll(async () => {
      await page.goto('https://andrewtran5222.github.io/CSE110-SP24-Lab6-Template');
    });
  
    const noteContent1 = 'Editing a new note';
    test('Adding and Editing a new note and saving', async () => {
        await page.click('.add-note');
        await page.focus('.note');
        await page.keyboard.type(noteContent1);
        await page.keyboard.press('Tab'); // Save by pressing Tab
        const savedNote = await page.$eval('.note', note => note.value);
        expect(savedNote).toBe(noteContent1);
    });
    
    test('Editing an existing note and saving', async () => {
        const noteContent2 = 'Editing an existing note and saving';
        await page.focus('.note');
        // Erase initial note content before editing
        for(let i = 0; i < noteContent1.length; i++)
        {
            await page.keyboard.press('Backspace');
        }
        await page.keyboard.type(noteContent2);
        await page.keyboard.press('Tab'); // Save by pressing Tab
        const savedNote = await page.$eval('.note', note => note.value);
        expect(savedNote).toBe(noteContent2);
    });
    
    test('Notes are saved locally after refreshing page', async () => {
        // Refresh page
        await page.reload();
        const savedNote = await page.$eval('.note', note => note.value);
        expect(savedNote).not.toBe('');
    });

    test('Delete all notes with Ctrl + Shift + D', async () => {
        // Trigger Ctrl + Shift + D
        await page.keyboard.down('Control');
        await page.keyboard.down('Shift');
        await page.keyboard.press('KeyD');
        await page.keyboard.up('Shift');
        await page.keyboard.up('Control');
      
        // Check if no notes are present
        const noteElements = await page.$$('.note');
        expect(noteElements.length).toBe(0);
    });
    
    test('Delete note by double clicking', async () => {
        await page.click('.add-note');
        await page.focus('.note');
        await page.keyboard.type('Note to be deleted by double clicking');
        await page.keyboard.press('Tab'); 
        // Trigger Double Click
        await page.evaluate(() => {
          const note = document.querySelector('.note');
          note.dispatchEvent(new MouseEvent('dblclick'));
        });
        const noteExists = await page.$('.note');
        expect(noteExists).toBeNull();
    });
});
  