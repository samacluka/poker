# Poker Simulator
A simple poker simulator I made solely to mess around with the math related to texas holdem.

At the bottom of the poker.ts file I left two example of how you could use this to see simulate poker games. 

Of course, betting is not at all factored into the code. This is just about the cards and numbers. 

### Known Issues
The application is generally stable, but I'm sure there are edge cases and oversights, because I wrote this purely for fun.
One example is, if after the river is revealed all the players can use the communal cards to get the best possible hand (that is, their dealt cards are of no benefit to them) the system considers this a tie and just (randomly?) selects a winner.