export const INITIAL_MESSAGES = [
    {
        sender: '+15552345678',
        content: 'Congratulations! You\'ve won a $1000 Walmart gift card. Go to http://bit.ly/w-mart-winner to claim now.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        sender: 'Sarah',
        content: 'Hey! Are you free for coffee tomorrow morning? Let me know!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        sender: 'FedEx',
        content: 'Your package with tracking number #84391032 is out for delivery and will arrive today.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        sender: '+15558765432',
        content: 'URGENT: Your bank account has been suspended due to suspicious activity. Please verify your identity here: http://secure-bank-login.xyz',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
        sender: 'Mom',
        content: 'Don\'t forget to pick up milk on your way home. Love you!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        sender: 'Unknown',
        content: 'We\'ve been trying to reach you about your car\'s extended warranty. This is your final notice.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
     {
        sender: 'Appointment Reminder',
        content: 'Reminder: You have a dental cleaning appointment tomorrow at 10:30 AM with Dr. Smith.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
];
