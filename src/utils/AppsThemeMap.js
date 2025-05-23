export const AppsThemeMap = () => {
    return [
        {
            apiKey: process.env.REACT_APP_IDEA_CHALLENGE_KEY,
            appKey: 'idea-challenge',
            logo: "assets/images/idea-challenge-logo.png"
        },
        {
            apiKey: process.env.REACT_APP_REVOLUTION_WORKSHOP_KEY,
            appKey: 'revolution-workshop',
            logo: "assets/images/revolution-workshop-logo.png"
        },
    ]
};