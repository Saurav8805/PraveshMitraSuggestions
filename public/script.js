// Smooth scroll to form
function scrollToForm() {
    document.getElementById('formSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
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
                
                // If document link is provided, add it to success message
                if (result.documentLink) {
                    const successText = successMessage.querySelector('p');
                    const documentButton = document.createElement('a');
                    documentButton.href = result.documentLink;
                    documentButton.target = '_blank';
                    documentButton.style.cssText = 'display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 15px;';
                    documentButton.textContent = '📄 View Your College List';
                    
                    const docInfo = document.createElement('p');
                    docInfo.style.cssText = 'margin-top: 10px; font-size: 14px; color: #718096;';
                    docInfo.textContent = result.documentName || 'Access your personalized college list';
                    
                    successMessage.appendChild(docInfo);
                    successMessage.appendChild(documentButton);
                }
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Hide success message after 10 seconds (longer since there's a link)
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    // Remove added elements
                    const addedElements = successMessage.querySelectorAll('a, p:last-child');
                    addedElements.forEach(el => {
                        if (el.textContent.includes('college list') || el.textContent.includes('College List')) {
                            el.remove();
                        }
                    });
                }, 10000);
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
