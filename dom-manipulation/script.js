
document.addEventListener('DOMContentLoaded', function() {

    const quoteDisplayer = document.getElementById('quoteDisplay');
    const showQuoteBtn = document.getElementById('newQuote');

    const newQuoteTextElement = document.getElementById('newQuoteText'); 
    const newQuoteCategoryElement = document.getElementById('newQuoteCategory'); 

    const importQuotesBtn = document.getElementById('importQuotesBtn');
    const importFileInput = document.getElementById('importFile');

    const exportQuotesBtn = document.getElementById('exportQuotesBtn');

    // get the stored quotes under the key allUserQuotes
    const storedQuotesString = localStorage.getItem('allUsersQuotes');

    // Seed data - used only when localStorage is empty on first load
let DEFAULT_QUOTES = [ 
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only place where success comes before work is in the dictionary.", category: "Work Ethic"},
    { text: "Success is the sum of small efforts, repeated day in and day out.", category: "Persistence"},
    { text: "Greatness is the sum of small efforts, repeated day in and day out.", category: "Greatness"},
    { text: "The best way to predict the future is to create it.", category: "Vision & Action"},
    ];     

    // TODO: Server sync not yet implemented - these quotes are currently unused
    const SERVER_QUOTES = [
        { text: "Server Quote A: This data comes from the server.", category: "Server" },
        { text: "Server Quote B: Server's data takes precedence in a conflict.", category: "Precedence" }
    ]

    // checking if local storage is empty
    if(storedQuotesString === null) {
        localStorage.setItem('allUsersQuotes', JSON.stringify(DEFAULT_QUOTES));
    }
    let quotes = JSON.parse(localStorage.getItem('allUsersQuotes'));

    function displayQuote(quoteObject) {
        // 1. Get the quote displayer element (ensure it's accessible or passed in)
        // const quoteDisplayer = document.getElementById('quoteDisplay'); 
    
        // 2. Handle the "no quote" case
        if (!quoteObject || !quoteObject.text) {
            quoteDisplayer.innerHTML = '<p>No quotes available based on current selection.</p>';
            return;
        }
    
        // 3. Display the quote
        quoteDisplayer.innerHTML = 
            `<p class="quote-text">"${quoteObject.text}"</p>
            <span class="quote-category">Category: ${quoteObject.category}</span>`;
    }
    
    function showRandomQuote(){
        // This calls filterQuotes(), which reads the current filter and displays a random quote.
        filterQuotes();
    };

    function addQuote() {
        // **CRITICAL:** Use local variables to store the STRING value. 
        // Read from the global element references (newQuoteTextElement) See Lines 11 - 12.

        const userQuoteText = newQuoteTextElement.value.trim();
        const userQuoteCat = newQuoteCategoryElement.value.trim();

        // 1.1 making sure the input is not empty`
        if ( userQuoteText === '' || userQuoteCat === '') {
            alert('Add a quote to display. Make sure to add both text and category!');
            return;
        }

        // 2. storing them into a new array 
        const newQuoteObject = {
        text: userQuoteText,
        category: userQuoteCat
        };

        // 3. Instead of updating the quoteDisplayer.innerHTML 
        // now I will just call the helper function displayquote

        displayQuote(newQuoteObject);
        
        // 4. pushing the new added quote into the quotes array
        quotes.push(newQuoteObject);

        // Using local storage
        // stringify the quotes array to be used later
        const userAddedQuotes = JSON.stringify(quotes);
        localStorage.setItem('allUsersQuotes', userAddedQuotes);

        // 5. cleaning the input fields
        newQuoteTextElement.value = '';
        newQuoteCategoryElement.value = '';
        populateCategories();

    };

    exportQuotesBtn.addEventListener('click', () => {

        // 
        const quotesStringified = JSON.stringify(quotes, null, 2);
        const blob = new Blob ([quotesStringified], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        // we cant directly assing the URL to the button, so we secretly create a temp <a> anchor/link
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_quotes.json'; // the filename for the download
        a.click();

        
        // 6. Clean up: Revoke the temporary URL to free up browser memory
        URL.revokeObjectURL(url);
        console.log(`Export button clicked! and the url is: ${url}`);
        
    })

    // Merge imported quotes (duplicates allowed - consider deduplication in future)
    function importFromJsonFile(event) {
        // check is any files were selected 
        const file = event.target.files[0];
        if (!file){
            return; // Safe guard if the User cancelled file selection
        }

        const fileReader = new FileReader();
        // fire this function once the file has been successfuly read
        fileReader.onload = function(event) {
            const fileContent = event.target.result;

        try {
            // 1. parse the JSON string back into js array or object
            const importedQuotes = JSON.parse(fileContent);

            // 2. validation check if null
            if(!Array.isArray(importedQuotes)) {
                alert('Import Failed: File content is not valid quotes array.');
                return;
            }

            // 3. merge the imported quotes
            quotes.push(...importedQuotes);

            // 4. update local storage
            localStorage.setItem('allUsersQuotes', JSON.stringify(quotes));

            // 5. update the display
            showRandomQuote();          
            alert('Quotes imported successfully!');

        } catch (err) {
            alert('Importing files failed', err.message);
            console.log('Importing file failed because: ', err.message);
        }
    };
    fileReader.readAsText(file);
    }

    // clicking the buttons
    importQuotesBtn.addEventListener('click', () => {
        importFileInput.click();
    });
    // the actual file reading happens when the file input changes
    importFileInput.addEventListener('change', importFromJsonFile);

    // Populate Categories Dynamically
    const categoryFilter = document.getElementById('categoryFilter');

    function populateCategories(){
        // 1. EXTRACT: Get an array of all category strings (including duplicates)
        const allCategories = quotes.map(quote => quote.category);

        // 2. UNIQUE: Use a Set to automatically get rid of duplicates
        // Extract unique categories for filter dropdown (removes duplicates via Set)
        const uniqueCategoriesSet = new Set(allCategories);

        // 3. ARRAY: Convert the Set back into an array
        const uniqueCategories = [...uniqueCategoriesSet];

        // 4 LOOP through uniqCategories and creat <option> elemet
        uniqueCategories.forEach(categoryString => {
            const optionElemenet = document.createElement('option');
            optionElemenet.value = categoryString;
            optionElemenet.textContent = categoryString;
            categoryFilter.append(optionElemenet);
        });
        // Get the last saved filter from local storage (defaults to 'all')
    const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';

    // Set the dropdown value to the saved filter
    categoryFilter.value = lastFilter;

    // Trigger the filtering and display based on the restored filter
    filterQuotes();

    }

    // Filter and display quotes based on selected category (persists selection to localStorage)
    function filterQuotes(){
        // 1. Get the selected category value
    const selectedCategory = categoryFilter.value;

    // 2. Persist the choice to Local Storage (MANDATORY STEP)
    // Use localStorage.setItem() here
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    let filteredQuotes;

    // 3. Filtering Logic (Handle 'all' vs. specific category)
    if (selectedCategory === 'all') {
        filteredQuotes = quotes; // Use the entire array
    } else {
        // Use the Array.prototype.filter() method
        // YOUR CODE HERE
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    // 4. Check if the filtered array is empty
    if (filteredQuotes.length === 0) {
        // Display a message if no quotes match the filter
        displayQuote(null); // using the helper
        return;
    }
    
    // 5. Display a random quote from the filtered list
    const quoteIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[quoteIndex];

    // Update the innerHTML of the quoteDisplayer: this was duplicate twice
    // So now I will just call the helper function displayQuote()
    displayQuote(selectedQuote);
}

    // ====================================================
    // Function 1: Simulate fetching quotes from server
function fetchQuotesFromServer() {
    // This simulates getting data from a server
    // For now, just return your SERVER_QUOTES array
    
    // In a real app, this would be:
    // return fetch('https://api.example.com/quotes').then(...)
    
    return SERVER_QUOTES; // Return the "server" data
}

// Function 2: Main sync logic
function syncQuotes() {
    // Step 1: Fetch server data
    const serverQuotes = fetchQuotesFromServer();
    
    // Step 2: Get local data
    const localQuotes = quotes;
    
    // Step 3: Track changes for notification
    let conflictsResolved = 0;
    let newQuotesAdded = 0;
    
    // Step 4: Loop through server quotes
    serverQuotes.forEach(serverQuote => {
        
        // Check if this server quote exists locally
        const existingQuote = localQuotes.find(localQ => {
            return localQ.text === serverQuote.text;
        });
        
        if (existingQuote) {
            // Quote exists! Check for conflict
            if (existingQuote.category !== serverQuote.category) {
                // CONFLICT! Server wins
                const index = localQuotes.findIndex(q => q.text === serverQuote.text);
                localQuotes[index] = serverQuote;
                conflictsResolved++;
            }
        } else {
            // New quote from server - add it
            localQuotes.push(serverQuote);
            newQuotesAdded++;
        }
    });
    
    // Step 5: Save to localStorage
    localStorage.setItem('allUsersQuotes', JSON.stringify(localQuotes));
    
    // Step 6: Update display
    showRandomQuote();
    populateCategories();
    
    // Step 7: Show notification
    showSyncNotification(newQuotesAdded, conflictsResolved);
}

// Function 3: UI notification (the autochecker needs this)
function showSyncNotification(newQuotes, conflicts) {
    const notification = document.getElementById('syncNotification');
    
    if (!notification) {
        console.error('Notification element not found!');
        return;
    }
    
    // Build the message
    let message = 'Sync complete! ';
    
    if (newQuotes > 0) {
        message += `Added ${newQuotes} new quote(s). `;
    }
    
    if (conflicts > 0) {
        message += `Resolved ${conflicts} conflict(s) (server data used).`;
    }
    
    if (newQuotes === 0 && conflicts === 0) {
        message = 'Sync complete! No changes needed.';
    }
    
    notification.textContent = message;
    notification.style.backgroundColor = '#d4edda'; // Green background
    notification.style.color = '#155724';
}


    // ##########
    // Manual sync button
const syncBtn = document.getElementById('syncDataBtn');
syncBtn.addEventListener('click', syncQuotes); // Call syncQuotes

// Automatic periodic sync (every 30 seconds)
setInterval(syncQuotes, 30000);

// Expose for potential inline handlers (if needed)
window.syncQuotes = syncQuotes;

    // ====================================================

    // INITIALIZATION
     showQuoteBtn.addEventListener('click', showRandomQuote); // changed from calling filter to showRandomQuote()
     
     showRandomQuote();    // Calls showRandomQuote(), which calls filterQuotes()
     populateCategories();

     // Make them global for HTML handlers
    window.addQuote = addQuote;
    window.filterQuotes = filterQuotes;
    });