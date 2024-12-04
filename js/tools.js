// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push("Password should be at least 8 characters long");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Add uppercase letters");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Add lowercase letters");
    }

    // Numbers check
    if (/[0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Add numbers");
    }

    // Special characters check
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push("Add special characters");
    }

    return {
        strength: (strength / 5) * 100,
        feedback: feedback
    };
}

// Hash Generator
async function generateHash() {
    const text = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    let hash;
    switch(hashType) {
        case 'sha256':
            hash = await crypto.subtle.digest('SHA-256', data);
            break;
        case 'sha512':
            hash = await crypto.subtle.digest('SHA-512', data);
            break;
        default:
            // MD5 implementation would go here
            break;
    }
    
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    document.getElementById('hashOutput').textContent = hashHex;
} 