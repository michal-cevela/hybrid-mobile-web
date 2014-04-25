## A sample of an enterprise hybrid-mobile web application

### Overview
The main idea behind this application was to provide a functional example of how a real enterprise hybrid-mobile web application could be developed using a different sort of open-source tools, frameworks and libraries currently available to both frontend and backend developers.

Although this application could potentially become a valueable source of information to some developers, a couple of configuration files such as *frontend/Gruntfile.js* and *backend/pom.xml* have been removed from this repository in order to prevent the application as a whole from being simply copied into a production environment. The reason for doing so is that this full-stack application is meant to serve as a showcase, thus everyone is welcome to use any pieces of the source code for information or experimental purposes.

### 1. Frontend
To make the frontend development smoother, I got the [**NPM**](http://www.npmjs.org) (Node Package Manager) installed and leveraged it when scaffolding the project structure, resolving dependencies as well as building a mobile version and deploying it on the Android platform.

The frontend part then consists of the following packages:

* [Yeoman](http://yeoman.io)
* [Grunt](http://gruntjs.com)
* [**Bower**](http://bower.io)
* [**AngularJS**](http://angularjs.org) v1.2.x (including the [ui-router](https://github.com/angular-ui/ui-router) module)
* [WebSockets](http://en.wikipedia.org/wiki/WebSocket)
* [Twitter Bootstrap](http://getbootstrap.com) v3.x (including [jQuery](http://jquery.com) as its underlying dependency)

Regarding the AngularJS framework, the main routing logic was designed in a rather generic way in order to take a full advantage of creating so called [SPA](http://en.wikipedia.org/wiki/Single-page_application) (Single Page Applications). This basically means that new UI views can be quickly registered on the fly just by taking few simple steps. Furthermore, all can happen without having to completely reload the application which is exactly what I imagine when thinking about a component-oriented web design anyway. Well, Angular rules!

### 2. Backend
At the very first stage I started on a crossroad while designing the backend as I was hesitating a bit between picking up an old good Java friend and a modern scalable [Meteor.js](https://meteor.com) platform. Well, after considering several technologies that were planned to be involved in the backend, I eventually ended up laying out Java foundations as I found this approach more flexible and also richer in terms of _what_ all can be brought into the whole solution later on and even more importantly _how_ it could be achieved.

To make the backend part both compact and portable among most of the modern application servers and servlet containers, I have utilized the following software tools or frameworks respectively:

* [**Apache CXF**](http://cxf.apache.org) ([JAX-WS](http://cxf.apache.org/docs/jax-ws-configuration.html), [JAX-RS](http://cxf.apache.org/docs/jax-rs.html))
* [**Spring**](http://spring.io)
* [MongoDB](http://www.mongodb.org)
* [Maven](http://maven.apache.org)
* [Jackson](http://jackson.codehouse.org)
* [Swagger](http://swagger.wordnik.com)

To keep modularity in mind, the *Spring* framework was brought into an existing solution as it can be easily integrated with a number of open-source products distributed under the Apache licence. In addition to that the support for asynchronous RESTful APIs is already implemented in the project so that new Web 3.0 features are ready to be used when needed.

When it comes to Web Services, both RESTful APIs and SOAP endpoints are published using a Spring-CXF XML descriptor which makes the Web Services incredibly easy to work with and also maintain. Apart from that the suggested concept of designing hypermedia-driven RESTful APIs was taken into consideration too. At the end particular data records can be retrieved in a different format (MIME types) such as JSON, JSONP or XML along with a set of links pointing to accessible resources. Please see [HATEOAS](http://spring.io/understanding/HATEOAS) for more information.

### 3. Mobile version
For some reason I was feeling an affinity to the [Apache Cordova](http://cordova.apache.org) framework when making a decision regarding building the application for the Android platform. This part was, however, a bit tricky and made me thinking for a certain period of time indeed. Obviously the mobile world has its own set of rules that do not always match the rules existing in the enterprise world which was truly challenging to deal with in some cases. Well, this part gave me a proper lesson, no question about that :-)

### 4. Middleware
To make the given solution open to a further enterprise integration, [Apache ServiceMix](http://servicemix.apache.org) along with [Apache ActiveMQ](http://activemq.apache.org) were set up appropriately. Having said that not only web clients can communicate with the backend using, for instance, the [STOMP](http://stomp.github.io) or [MQTT](http://mqtt.org) protocol over [WebSockets](http://www.websockets.org). Furthermore, some parts of the business logic can be added on demand using hot deployment which is a great feature when building 100% [SOA]((http://en.wikipedia.org/wiki/Service-oriented_architecture)) applications consisting of loosely-coupled components. In this sense ServiceMix can act as an additional runtime that some business modules can be deployed onto. Clients can then interact with the server-side logic via RESTful APIs, SOAP endpoints or [MDBs](http://docs.oracle.com/javaee/7/tutorial/doc/ejb-intro003.htm) (Message-Driven Beans). Broadly speaking, such a concept nicely taps the SOA approach on the shoulder :-)

### 5. [BPM](http://en.wikipedia.org/wiki/Business_process_management)
Even though I am a novice in the BPM field, the [Activiti.org](http://activiti.org) framework can be quickly integrated into ServiceMix when required.

### 6. Possible improvements
Given the Twitter Bootstrap, the [IonicUI](http://ionicframework.com) framework or just the Angular ui-bootstrap module could be a better choice since they both have been designed with AngularJS in mind and do not therefore require the jQuery library to be included as a dependency.

Regarding the communication with REST APIs, the Restangular module is generally considered to be a more suitable solution as compared to the native ngResource module.

As far as the integration stuff is concerned, [Mule ESB](https://www.mulesoft.org), [Apache Camel](http://camel.apache.org) or [Spring EIP](http://projects.spring.io/spring-integration/) might be worth a further consideration as they all provide a number of useful EIPs (Enterprise Integration Patterns) applicable on the backend.

Last but not least, to build the entire application using only JavaScript syntax, [Meteor.js](https://meteor.com) or a combination of Node.js and Express would be probably the best choice available to full-stack JavaScript developers these days I assume.

### 7. Inspiration

Here is the list of video tutorials I have watched recently:

* [Angular Best Practices](http://avaxhome.cc/ebooks/eLearning/Pluralsight_Angular_Best_Practices.html) (2013)
* [Building apps with Angular and Breeze](http://avaxhome.cc/ebooks/programming_development/html_css_js_javascript/PluralsightBuildingAppswithAngularandBreeze2013.html) (2013)
* [How to build a hypermedia-driven REST API](http://avaxhome.cc/ebooks/eLearning/Tutsplus_How_to_Build_a_Hypermedia_Driven_REST_API.html) (2014)
