import React from 'react';
import Footer from '../Footer/Footer';

export default function HomePage() {
    return (
        <div className="backimage d-flex min-vh-100 text-center text-white bg-dark flex-column">
            <header >
                <div>
                    <h3 className="float-md-start mb-0">To-Do App</h3>
                    <nav className="nav nav-masthead justify-content-center float-md-end">
                        <a className="nav-link active" aria-current="page" href="/home">Home</a>
                        <a className="nav-link" href="/todo">To-Do List</a>
                    </nav>
                </div>
            </header>

            <main className="px-3 my-auto">
                <h1>About the page</h1>
                <p className='lead' >This page its developed with 2 technolgies, Backend with Python/Flask and Frontend with JS/React, and for the DB SQLite.</p>
                <h1>Purpose</h1>
                <p className="lead">This web-app its designed to keep your tasks in a beautiful list of to-do's, mimicking Jira/Trello. Feel free to try it!</p>
                <p className="lead">
                    <a href="/todo" className="btn btn-lg btn-secondary fw-bold border-white bg-dark">Get started</a>
                </p>

            </main>

            <Footer />
        </div>
    );
}

