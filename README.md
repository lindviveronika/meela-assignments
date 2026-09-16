# Take-home task: Client Onboarding Form

## Summary

Here is my solution to the take-home task. I chose to use React on the frontend since that is what I have most experience with. The frontend is also the part where I put most of my effort.

The application has a home page where you can create new onboarding submissions and see a list of existing drafts. This is of course only for testing and reviewing purposes. ☺️

I chose to save the answers as a JSON blob in the database since that will give more flexibility in the future when questions are added or removed. Which step the user is on is saved as an id instead of a number in case the question changes order. If the saved step would be removed the frontend falls back to the first question. The frontend owns the order of the questions.

The frontend loads the ongoing form submission by the id and then navigates to the correct step in the form and sets the form state from the answers returned from the API.

## Screenshots

- [First question](screenshots/Step1.png)
- [Second question](screenshots/Step2.png)
- [Third question](screenshots/Step3.png)
- [Progress saved](screenshots/SaveProgress.png)
- [Home](screenshots/Home.png)

## How to set it up

Start the backend in one terminal:

```sh
cd backend
cargo install sqlx-cli
sqlx db create
sqlx migrate run
cargo run
```

Start the frontend in another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173/

## Future improvements

- Actual submit logic including validation (both frontend and backend) of that required questions have been answered and have the correct format. This would include adding an answer schema to the backend which will be needed to actually use the data in the future. When doing this I would also add validation to the update endpoint to make sure the current step is a known step and that the answers conform to the form schema with all fields optional.
- A separate submit page in the form instead of just exchanging the next button on last page to make it more clear for the user that the form will be submitted.
- Handle the case if someone navigates (by using an old bookmark or similar) to an already submitted form. I would've shown a message saying that it has already been submitted.
- Proper styling of loading and error messages.
- Automatic saving. I went for the save button now for simplicity. Having both would be nice.
- Responsiveness. The navigation buttons on the bottom of the form doesn’t fit well on a smaller screen.
- Unit tests!

## Note

- I have tested the application in Chrome v.152.
- If this would've been a production app I would likely have used a library for the data fetching in the frontend instead of the data fetching logic that I have implemeneted myself.
