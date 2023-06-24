# fit-buddy

## Prerequisites

You must have the following install in order to run the project:

- Node.js (>=v16)
- yarn -> `npm install -g yarn`

## Installing the dependencies

The dependencies are being install by typing the `yarn` in the terminal.

## Environment variables

You can copy the contents of `.env.example` file by doing `cp .env.example .env` and fill all the information.

### Notes

- `NEXT_PUBLIC_STRIPE_KEY` and `STRIPE_SECRET_KEY` are from creating a project in stripe
- `STRIPE_SIGNING_SECRET` is from the webhook

## Running the project

To run the project, input the following command: `yarn run dev`
