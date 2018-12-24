Web app that allows customers to book their hotel rooms easily, and allows hotel owners to manage their reservations efficiently.

## How it works
Typically, almost all functionalities follows the same pattern, of which an event is invoked on the client side (button click, form submission..etc.), which then sends a HTTP request to the server, that passes through a series of authentication and validation middlewares, and if it managed to survive, it's then sent to the suitable service that is implemented to serve it.
After that, a response is sent loaded with the requested data, or a suitable view is rendered.

## Actors
The users of the application can be classified into:

#### Customers
A customer must sign up or log in to view his profile, which allows him to view his past and current reservations, as well as allowing him to search and book his desired room with the help of 10 parameters search tool.

#### Hotel Owner
Same as the customer, the owner may view his profile after signing up or logging in, which let him create a hotel, a room, view his pending reservations, check in a user, black-list a user, and a variety of helpful functionalities.

#### Admin(s)
Unlike the other users, admin has a back-door way to login to the server, after that, he get access to the control panel, through which he may suspend or un-suspend hotels, approve and reject hotels, or view hotels payments to the app.



## Technologies
- Express.js
- Ejs view engine
- Moment.js
- MySQL


## Sample Screenshots
![ScreenShot1](https://github.com/ahmedhammad97/Hotel-Reservation-System/blob/master/Screenshots/1.png)
![ScreenShot2](https://github.com/ahmedhammad97/Hotel-Reservation-System/blob/master/Screenshots/2.png)
![ScreenShot3](https://github.com/ahmedhammad97/Hotel-Reservation-System/blob/master/Screenshots/3.png)
![ScreenShot4](https://github.com/ahmedhammad97/Hotel-Reservation-System/blob/master/Screenshots/4.png)
