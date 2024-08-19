 

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // or 'STARTTLS'
        auth: {
            user: 'aseemguptajaipur@gmail.com',
            pass: 'euyfkkdajjietpke'
        }    
    },
    google_client_id:'953049878561-6n24jb370ng0rlflve3384hsd1ntilk2.apps.googleusercontent.com',
    google_client_secret: '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',
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
}


const production =  {
    name: 'production'
}



module.exports = development;