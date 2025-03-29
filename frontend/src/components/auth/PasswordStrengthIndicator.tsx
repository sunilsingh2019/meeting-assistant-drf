interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const calculateStrength = (password: string): { strength: number; feedback: string } => {
    let strength = 0;
    let feedback = '';

    if (password.length === 0) {
      return { strength: 0, feedback: '' };
    }

    // Length check
    if (password.length >= 8) {
      strength += 1;
    }

    // Contains number
    if (/\d/.test(password)) {
      strength += 1;
    }

    // Contains lowercase
    if (/[a-z]/.test(password)) {
      strength += 1;
    }

    // Contains uppercase
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }

    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 1;
    }

    // Feedback based on strength
    switch (strength) {
      case 0:
        feedback = 'Very weak';
        break;
      case 1:
        feedback = 'Weak';
        break;
      case 2:
        feedback = 'Fair';
        break;
      case 3:
        feedback = 'Good';
        break;
      case 4:
        feedback = 'Strong';
        break;
      case 5:
        feedback = 'Very strong';
        break;
      default:
        feedback = '';
    }

    return { strength, feedback };
  };

  const { strength, feedback } = calculateStrength(password);
  const strengthPercentage = (strength / 5) * 100;

  const getStrengthColor = (strength: number): string => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (strength === 2) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (strength === 3) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (strength === 4) return 'bg-gradient-to-r from-green-500 to-green-600';
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  };

  const getDotColor = (strength: number): string => {
    if (strength === 0) return 'bg-gray-400';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
            style={{ 
              width: `${strengthPercentage}%`,
              boxShadow: strength > 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          />
        </div>
        <div 
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${getDotColor(strength)}`} 
          title={feedback}
        />
      </div>
      <div className="space-y-1.5 mt-3">
        <div className={`text-xs flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
          <svg className={`w-4 h-4 mr-1.5 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Minimum 8 characters
        </div>
        <div className={`text-xs flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
          <svg className={`w-4 h-4 mr-1.5 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          At least one uppercase letter
        </div>
        <div className={`text-xs flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
          <svg className={`w-4 h-4 mr-1.5 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          At least one lowercase letter
        </div>
        <div className={`text-xs flex items-center ${/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
          <svg className={`w-4 h-4 mr-1.5 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          At least one number
        </div>
        <div className={`text-xs flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
          <svg className={`w-4 h-4 mr-1.5 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          At least one special character
        </div>
      </div>
    </div>
  );
}; 