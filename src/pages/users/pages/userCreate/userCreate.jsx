

import * as a from "./userCreate.js"
// KAMBIAR AL FINAL POR "userCreateJS"          <---- !!


export const UserCreate = () => {

    const handleSubmit = e => {
        e.preventDefault();
        // if (userName === 'admin' && userPassword === '1234') {
        //     navigate('/dashboard')
        //     localStorage.setItem('isAuthenticated', 'true');
        // } else {
        //     localStorage.removeItem('isAuthenticated');
        //     alert('tas ekivokao')
        // }
        console.log('ola')
    }

    return (

        <a.SectionPageUserCreate>

            <a.IconHotel />

            <a.Form onSubmit={handleSubmit}>
                <a.LabelUsername>Username
                    <a.InputUsername
                        placeholder="admin"
                        // value={userName}
                        onChange={(e) => setUserName(e.currentTarget.value)}
                    />
                </a.LabelUsername>
                <a.LabelPassword>Password
                    <a.InputPassword
                        placeholder="1234"
                        // value={userPassword}
                        onChange={(e) => setUserPassword(e.currentTarget.value)}
                    />
                </a.LabelPassword>
                <a.ButtonSignUp type="submit">Sign Up</a.ButtonSignUp>
            </a.Form>

        </a.SectionPageUserCreate>

    );
}