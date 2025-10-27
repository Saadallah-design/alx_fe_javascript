
// <!-- JS CODE BELOW -->
document.addEventListener('DOMContentLoaded', function() {

    const quoteDisplayer = document.getElementById('quoteDisplay');
    const showQuoteBtn = document.getElementById('newQuote');
    const formContainer = document.getElementById('formContainer')


    // **CRITICAL FIX:** Global variables to hold the DYNAMICALLY CREATED input elements.
    let newQuoteTextElement; // Renamed to avoid confusion with the value
    let newQuoteCategoryElement; // Renamed to avoid confusion with the value

    // array of quotes as object
    // Seed Data
    let DEFAULT_QUOTES = [ 
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only place where success comes before work is in the dictionary.", category: "Work Ethic"},
    { text: "Success is the sum of small efforts, repeated day in and day out.", category: "Persistence"},
    { text: "Greatness is the sum of small efforts, repeated day in and day out.", category: "Greatness"},
    { text: "The best way to predict the future is to create it.", category: "Vision & Action"},
    ];     

    const storedQuotesString = localStorage.getItem('allUsersQuotes');

    // checking if local storage is empty
    if(storedQuotesString === null) {
        localStorage.setItem('allUsersQuotes', JSON.stringify(DEFAULT_QUOTES));
    }
    let quotes = JSON.parse(localStorage.getItem('allUsersQuotes'));


    
    // show random quote function
    function showRandomQuote(){
        // 
        if (quotes.length === 0) {
            quoteDisplayer.innerHTML = '<p>No quotes available. Add one!</p>';
            return;
        }

        // 1. Calculate a NEW random index every time the function runs
        let quoteIndex = Math.floor(Math.random() * quotes.length);

        // 2. Select the corresponding quote object
        let selectedQuote = quotes[quoteIndex];

         // 3. Update the innerHTML with the specific text and category
            // We use the object properties: selectedQuote.text and selectedQuote.category
            quoteDisplayer.innerHTML = 
            `<p class="quote-text">"${selectedQuote.text}"</p>
            <span class="quote-category">Category: ${selectedQuote.category}</span>`;
            
        // quoteDisplayer.innerHTML = `<div> ${quotes.text} <span> ${quotes.category}</span> </div>`;
        
    };

    // ---------------------------------------------

    function addQuote() {
        // 1. getting the value the user put into the form and store them in vars
        // **CRITICAL:** Use local variables to store the STRING value. 
        // Read from the global element references (newQuoteTextElement).

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

        // 3. updating the inner html
        quoteDisplayer.innerHTML = 
            `<p class="quote-text">"${userQuoteText}"</p>
            <span class="quote-category">Category: ${userQuoteCat}</span>`;

        
        // 4. pushing the new added quote into the quotes array
        quotes.push(newQuoteObject);

        // Using local storage
        // stringify the quotes array to be used later
        const userAddedQuotes = JSON.stringify(quotes);
        localStorage.setItem('allUsersQuotes', userAddedQuotes);

        // 5. cleaning the input fields
        newQuoteTextElement.value = '';
        newQuoteCategoryElement.value = '';

    };


    // 3. Create the formQuote

    function createAddQuoteForm() {
        
        // 1. Creating the form elements
        const formDiv = document.createElement('div');

        // **CRITICAL FIX:** Assigning the newly created elements to the GLOBAL variables.


        newQuoteTextElement = document.createElement('input');
        newQuoteTextElement.placeholder = "Write your quote here";

        newQuoteCategoryElement = document.createElement('input');
        newQuoteCategoryElement.placeholder = "Write the quote category";

        const btn = document.createElement('button');
        btn.textContent = 'Add Quote';

        btn.addEventListener('click', addQuote);

        // appending these elements
        formDiv.appendChild(newQuoteTextElement);
        formDiv.appendChild(newQuoteCategoryElement);
        formDiv.appendChild(btn)

        formContainer.appendChild(formDiv);
    }

    // Download link
    const exportQuotesBtn = document.getElementById('exportQuotesBtn');
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


    const importQuotesBtn = document.getElementById('importQuotesBtn');
    const importFileInput = document.getElementById('importFile');

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
            alert('Impprting files failed', err.message);
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
        


    // INITIALIZATION
     // Setup listener for the main button
     showQuoteBtn.addEventListener('click', showRandomQuote);
     
     // **MANDATORY FIXES:** Initialize the application
     createAddQuoteForm(); // Builds the form on load
     showRandomQuote();    // Shows the first quote on load



    });