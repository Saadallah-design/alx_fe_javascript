
// <!-- JS CODE BELOW -->
    const quoteDisplayer = document.getElementById('quoteDisplay');
    const showQuoteBtn = document.getElementById('newQuote');
    const formContainer = document.getElementById('formContainer')


    // **CRITICAL FIX:** Global variables to hold the DYNAMICALLY CREATED input elements.
    let newQuoteTextElement; // Renamed to avoid confusion with the value
    let newQuoteCategoryElement; // Renamed to avoid confusion with the value

    // array of quotes as object
    const quotes = [ 
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only place where success comes before work is in the dictionary.", category: "Work Ethic"},
    { text: "Success is the sum of small efforts, repeated day in and day out.", category: "Persistence"},
    { text: "Perseverance is the hard work you do after you get tired of doing the hard work you already did.", category: "Perseverance"},
    { text: "The best way to predict the future is to create it.", category: "Vision & Action"},
    ];        
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

        const userQuoteText = newQuoteTextElement.value.trim();;
        const userQuoteCat = newQuoteCategoryElement.value.trim();;

        // 1.1 making sure the input is not empty
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
    // INITIALIZATION
     // Setup listener for the main button
     showQuoteBtn.addEventListener('click', showRandomQuote);
     
     // **MANDATORY FIXES:** Initialize the application
     createAddQuoteForm(); // Builds the form on load
     showRandomQuote();    // Shows the first quote on load