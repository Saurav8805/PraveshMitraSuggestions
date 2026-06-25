// OTP Verification Status
let otpVerification = {
    email: false,
    mobile: false
};

// Initialize OTP verification
document.addEventListener('DOMContentLoaded', function() {
    const fullName = document.getElementById('fullName');
    const mobileNo = document.getElementById('mobileNo');
    const email = document.getElementById('email');
    
    const sendMobileOtpBtn = document.getElementById('sendMobileOtp');
    const sendEmailOtpBtn = document.getElementById('sendEmailOtp');
    
    // Show send OTP button when inputs have valid values
    mobileNo.addEventListener('input', function() {
        if (mobileNo.value.length === 10 && /^[0-9]{10}$/.test(mobileNo.value)) {
            sendMobileOtpBtn.style.display = 'block';
        } else {
            sendMobileOtpBtn.style.display = 'none';
        }
    });
    
    email.addEventListener('input', function() {
        if (email.validity.valid && email.value) {
            sendEmailOtpBtn.style.display = 'block';
        } else {
            sendEmailOtpBtn.style.display = 'none';
        }
    });
    
    // Send Mobile OTP
    sendMobileOtpBtn.addEventListener('click', async function() {
        const mobile = mobileNo.value;
        const name = fullName.value || 'User';
        
        if (!mobile || mobile.length !== 10) {
            showOTPStatus('mobileOtpStatus', 'Please enter a valid 10-digit mobile number', 'error');
            return;
        }
        
        sendMobileOtpBtn.disabled = true;
        sendMobileOtpBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch('/api/send-sms-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, name })
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('mobileOtpSection').style.display = 'block';
                showOTPStatus('mobileOtpStatus', result.message, 'success');
                sendMobileOtpBtn.textContent = 'OTP Sent';
                mobileNo.readOnly = true;
                
                // Show mock OTP in development
                if (result.mockOTP) {
                    showOTPStatus('mobileOtpStatus', `Development Mode - OTP: ${result.mockOTP}`, 'info');
                }
            } else {
                showOTPStatus('mobileOtpStatus', result.message, 'error');
                sendMobileOtpBtn.disabled = false;
                sendMobileOtpBtn.textContent = 'Send OTP';
            }
        } catch (error) {
            console.error('Send mobile OTP error:', error);
            showOTPStatus('mobileOtpStatus', 'Network error. Please try again.', 'error');
            sendMobileOtpBtn.disabled = false;
            sendMobileOtpBtn.textContent = 'Send OTP';
        }
    });
    
    // Send Email OTP
    sendEmailOtpBtn.addEventListener('click', async function() {
        const emailValue = email.value;
        const name = fullName.value || 'User';
        
        if (!emailValue || !email.validity.valid) {
            showOTPStatus('emailOtpStatus', 'Please enter a valid email address', 'error');
            return;
        }
        
        sendEmailOtpBtn.disabled = true;
        sendEmailOtpBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch('/api/send-email-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue, name })
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('emailOtpSection').style.display = 'block';
                showOTPStatus('emailOtpStatus', result.message, 'success');
                sendEmailOtpBtn.textContent = 'OTP Sent';
                email.readOnly = true;
            } else {
                showOTPStatus('emailOtpStatus', result.message, 'error');
                sendEmailOtpBtn.disabled = false;
                sendEmailOtpBtn.textContent = 'Send OTP';
            }
        } catch (error) {
            console.error('Send email OTP error:', error);
            showOTPStatus('emailOtpStatus', 'Network error. Please try again.', 'error');
            sendEmailOtpBtn.disabled = false;
            sendEmailOtpBtn.textContent = 'Send OTP';
        }
    });
    
    // Verify Mobile OTP
    document.getElementById('verifyMobileOtp').addEventListener('click', async function() {
        const mobile = mobileNo.value;
        const otp = document.getElementById('mobileOtp').value;
        
        if (!otp || otp.length !== 6) {
            showOTPStatus('mobileOtpStatus', 'Please enter 6-digit OTP', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: mobile, otp, type: 'sms' })
            });
            
            const result = await response.json();
            
            if (result.success) {
                otpVerification.mobile = true;
                showOTPStatus('mobileOtpStatus', '✓ Mobile verified successfully!', 'success');
                document.getElementById('mobileOtpSection').style.display = 'none';
                sendMobileOtpBtn.style.display = 'none';
                
                // Show verified badge
                const badge = document.createElement('div');
                badge.className = 'verified-badge';
                badge.innerHTML = '✓ Verified';
                mobileNo.parentElement.appendChild(badge);
                
                checkBothVerified();
            } else {
                showOTPStatus('mobileOtpStatus', result.message, 'error');
            }
        } catch (error) {
            console.error('Verify mobile OTP error:', error);
            showOTPStatus('mobileOtpStatus', 'Network error. Please try again.', 'error');
        }
    });
    
    // Verify Email OTP
    document.getElementById('verifyEmailOtp').addEventListener('click', async function() {
        const emailValue = email.value;
        const otp = document.getElementById('emailOtp').value;
        
        if (!otp || otp.length !== 6) {
            showOTPStatus('emailOtpStatus', 'Please enter 6-digit OTP', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: emailValue, otp, type: 'email' })
            });
            
            const result = await response.json();
            
            if (result.success) {
                otpVerification.email = true;
                showOTPStatus('emailOtpStatus', '✓ Email verified successfully!', 'success');
                document.getElementById('emailOtpSection').style.display = 'none';
                sendEmailOtpBtn.style.display = 'none';
                
                // Show verified badge
                const badge = document.createElement('div');
                badge.className = 'verified-badge';
                badge.innerHTML = '✓ Verified';
                email.parentElement.appendChild(badge);
                
                checkBothVerified();
            } else {
                showOTPStatus('emailOtpStatus', result.message, 'error');
            }
        } catch (error) {
            console.error('Verify email OTP error:', error);
            showOTPStatus('emailOtpStatus', 'Network error. Please try again.', 'error');
        }
    });
    
    // Resend Mobile OTP
    document.getElementById('resendMobileOtp').addEventListener('click', async function() {
        const mobile = mobileNo.value;
        const name = fullName.value || 'User';
        
        const btn = this;
        btn.disabled = true;
        btn.textContent = 'Sending...';
        
        try {
            const response = await fetch('/api/send-sms-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, name })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showOTPStatus('mobileOtpStatus', 'OTP resent successfully', 'success');
                if (result.mockOTP) {
                    showOTPStatus('mobileOtpStatus', `Development Mode - OTP: ${result.mockOTP}`, 'info');
                }
            } else {
                showOTPStatus('mobileOtpStatus', result.message, 'error');
            }
        } catch (error) {
            showOTPStatus('mobileOtpStatus', 'Failed to resend OTP', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Resend OTP';
        }
    });
    
    // Resend Email OTP
    document.getElementById('resendEmailOtp').addEventListener('click', async function() {
        const emailValue = email.value;
        const name = fullName.value || 'User';
        
        const btn = this;
        btn.disabled = true;
        btn.textContent = 'Sending...';
        
        try {
            const response = await fetch('/api/send-email-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue, name })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showOTPStatus('emailOtpStatus', 'OTP resent successfully', 'success');
            } else {
                showOTPStatus('emailOtpStatus', result.message, 'error');
            }
        } catch (error) {
            showOTPStatus('emailOtpStatus', 'Failed to resend OTP', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Resend OTP';
        }
    });
});

// Show OTP status message
function showOTPStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    statusEl.textContent = message;
    statusEl.className = `otp-status ${type}`;
}

// Check if both are verified
function checkBothVerified() {
    if (otpVerification.email && otpVerification.mobile) {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// Disable submit button initially
window.addEventListener('load', function() {
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.title = 'Please verify email and mobile number first';
});

// Export verification status checker
window.isOTPVerified = function() {
    return otpVerification.email && otpVerification.mobile;
};
