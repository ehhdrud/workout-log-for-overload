export default function Home() {
    return (
        <main>
            <h2>Please enter the secret code.</h2>
            <form id="myForm">
                <input type="text" id="myInput" placeholder="secret code..." />
                <input type="submit" id="submitButton" value="submit" />
            </form>
        </main>
    );
}
