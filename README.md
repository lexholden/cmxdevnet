CMX DevNet Test
=========

A small, primitive test of the CMX api used at the devnet hackathon. We took co-ordinates of devices live, and mapped them to the physical space via a map.

Future versions intended to allow pushing of APIC EM policies favouring devices in particular areas of the space (e.g. prioritizing traffic to the hackathon space during the hack, but to the theatre space during a talk by a particular Vice President). Using temperature and humidity sensors would also have been added.

Be warned, in its current state this was built for a hackathon, so there is messy code all over the place.

How to Use
---------

The only configuration needed should be pointing the app to a live CMX installation - hard coded in `static/js/main.js`. Close to the top is the `cmxurl` variable. Change this.

Then simply open index.html in browser.


Limitations
---------

Since all the API handling is done in JavaScript, the CMX api's must be on the same domain. Currently they are hard coded to reference 10.10.30.23. 

This fits the hackathon this was built for, but something more complex would be needed for real use.
