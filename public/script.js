// Smooth scroll to form
function scrollToForm() {
    document.getElementById('formSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Reset form and clear success message
function resetSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const documentContainer = document.getElementById('documentLinkContainer');
    successMessage.classList.add('hidden');
    documentContainer.innerHTML = '';
}

// Toggle dropdown
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const allDropdowns = document.querySelectorAll('.custom-dropdown');
    
    // Close other dropdowns
    allDropdowns.forEach(d => {
        if (d.id !== dropdownId) {
            d.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active');
}

// Update dropdown text based on selections
function updateDropdownText(checkboxName, placeholderId, defaultText) {
    const checkboxes = document.querySelectorAll(`input[name="${checkboxName}"]:checked`);
    const placeholder = document.getElementById(placeholderId);
    
    if (checkboxes.length === 0) {
        placeholder.textContent = defaultText;
        placeholder.classList.remove('has-selection');
    } else if (checkboxes.length === 1) {
        placeholder.textContent = checkboxes[0].value;
        placeholder.classList.add('has-selection');
    } else {
        placeholder.textContent = `${checkboxes.length} selected`;
        placeholder.classList.add('has-selection');
    }
}

// Filter dropdown options based on search
function filterOptions(searchInputId, optionsContainerId) {
    const input = document.getElementById(searchInputId);
    if (!input) {
        // If called from event, get the input element from event target
        const eventInput = window.event ? window.event.target : null;
        if (!eventInput) return;
        
        const filter = eventInput.value.toLowerCase();
        const optionsContainer = eventInput.closest('.dropdown-menu').querySelector('.dropdown-options');
        const options = optionsContainer.querySelectorAll('.checkbox-option');
        
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(filter)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
        return;
    }
    
    const filter = input.value.toLowerCase();
    const optionsContainer = document.getElementById(optionsContainerId);
    const options = optionsContainer.querySelectorAll('.checkbox-option');
    
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(filter)) {
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});

// Get selected values from checkbox dropdown
function getSelectedCheckboxValues(checkboxName) {
    const checkboxes = document.querySelectorAll(`input[name="${checkboxName}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('counsellingForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'SUBMITTING...';

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            mobileNo: document.getElementById('mobileNo').value.trim(),
            email: document.getElementById('email').value.trim(),
            mhtCetScore: document.getElementById('mhtCetScore').value,
            jeeScore: document.getElementById('jeeScore').value || null,
            branches: getSelectedCheckboxValues('branches'),
            cities: getSelectedCheckboxValues('cities'),
            percentileRange: document.getElementById('percentileRange').value
        };

        // Validation
        if (!formData.percentileRange) {
            showError('Please select your percentile range');
            resetButton();
            return;
        }

        if (formData.branches.length === 0) {
            showError('Please select at least one branch');
            resetButton();
            return;
        }

        if (formData.cities.length === 0) {
            showError('Please select at least one city');
            resetButton();
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.mobileNo)) {
            showError('Please enter a valid 10-digit mobile number');
            resetButton();
            return;
        }

        try {
            // Submit form data
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                successMessage.classList.remove('hidden');
                form.reset();
                
                // If document link is provided, show it prominently
                if (result.documentLink) {
                    const documentContainer = document.getElementById('documentLinkContainer');
                    documentContainer.innerHTML = `
                        <div style="margin-top: 25px; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;">
                            <div style="font-size: 40px; margin-bottom: 10px;">📄</div>
                            <h3 style="color: white; margin: 10px 0; font-size: 20px;">${result.documentName || 'Your College List'}</h3>
                            <p style="color: rgba(255,255,255,0.9); margin: 15px 0; font-size: 14px;">Click below to open your document</p>
                            <a href="${result.documentLink}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               style="display: inline-block; 
                                      background: white; 
                                      color: #667eea; 
                                      padding: 14px 35px; 
                                      text-decoration: none; 
                                      border-radius: 25px; 
                                      font-weight: bold; 
                                      font-size: 16px; 
                                      margin-top: 10px;
                                      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                                      transition: transform 0.2s;
                                      cursor: pointer;">
                                📄 OPEN PDF IN GOOGLE DRIVE
                            </a>
                            <p style="color: rgba(255,255,255,0.8); margin-top: 15px; font-size: 13px;">Opens in a new tab</p>
                        </div>
                    `;
                }
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Don't auto-hide if there's a document link (user needs time to click it)
                if (!result.documentLink) {
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 5000);
                }
            } else {
                showError(result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            resetButton();
        }
    });

    function showError(message) {
        errorMessage.querySelector('p').textContent = message;
        errorMessage.classList.remove('hidden');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'GET MY SUGGESTIONS';
    }

    // Mobile number validation
    document.getElementById('mobileNo').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    // Score validation
    document.getElementById('mhtCetScore').addEventListener('input', function(e) {
        if (parseFloat(this.value) > 200) {
            this.value = 200;
        }
    });

    document.getElementById('jeeScore').addEventListener('input', function(e) {
        if (parseFloat(this.value) > 360) {
            this.value = 360;
        }
    });
});
