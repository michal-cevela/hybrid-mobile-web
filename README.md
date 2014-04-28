## A sample of an enterprise hybrid-mobile web application

### Overview
The main idea behind this application was to provide a functional example of how a real enterprise hybrid-mobile web application could be developed using a different sort of open-source tools, frameworks and libraries currently available to both frontend and backend developers.

Although this application is fairly simple, it covers several design patterns that can be found in modern scalable responsive web applications.

### 1. Frontend
To make the frontend development smoother, I got the [**NPM**](http://www.npmjs.org) (Node Package Manager) installed and leveraged it when scaffolding the project structure, resolving dependencies as well as building a mobile version and deploying it on the Android platform.

The frontend part then consists of the following packages:

* [Yeoman](http://yeoman.io)
* [Grunt](http://gruntjs.com)
* [**Bower**](http://bower.io)
* [**AngularJS**](http://angularjs.org) v1.2.x (including the [ui-router](https://github.com/angular-ui/ui-router) module)
* [**WebSockets**](http://en.wikipedia.org/wiki/WebSocket) (including [STOMP](https://github.com/jmesnil/stomp-websocket))
* [Twitter Bootstrap](http://getbootstrap.com) v3.x (including [jQuery](http://jquery.com) as its underlying dependency)

Regarding the AngularJS framework, the main routing logic was designed in a rather generic way in order to take a full advantage of creating a component-based [SPA](http://en.wikipedia.org/wiki/Single-page_application) (Single Page Applications). This basically means that new UI views can be quickly registered on the fly using a lazy loading technique. Furthermore, all can happen without having the application to be completely reloaded which is how some CMS are desired to be developed. Well, Angular is truly sophisticated and powerful framework even though its learning curve becomes fairly steep after some time!

### 2. Backend
At the very first stage I started on a crossroad while designing the backend as I was hesitating a bit between picking up an old good Java friend and a modern scalable [Meteor.js](https://meteor.com) platform. Well, after considering several technologies that were planned to be involved in the backend, I eventually ended up laying out Java foundations as I was feeling more experienced in developing J2EE-based solutions.

To keep the backend fast, easy to understand, compact and portable among most of the modern Java application servers and servlet containers, I have utilized the following software tools or frameworks respectively:

* [**Apache Tomcat 7.x**](http://tomcat.apache.org)
* [**Apache CXF**](http://cxf.apache.org) ([JAX-WS](http://cxf.apache.org/docs/jax-ws-configuration.html), [JAX-RS](http://cxf.apache.org/docs/jax-rs.html))
* [**Atmosphere**](https://github.com/Atmosphere/atmosphere)
* [**Spring**](http://spring.io)
* [MongoDB](http://www.mongodb.org)
* [Maven](http://maven.apache.org)
* [Jackson](http://jackson.codehouse.org)
* [Swagger](http://swagger.wordnik.com)

To bear modularity in mind, the *Spring* framework was brought into an existing solution as it can be easily integrated with a number of open-source products distributed not only under the Apache licence. In addition to that the support for WebSockets, Servlets v3.1 and asynchronous RESTful APIs (JAX-RS v2.0) is already implemented in the project so that new Web 3.0 features are ready to be used when needed.

When it comes to Web Services, both RESTful APIs and SOAP endpoints are published using an XML descriptor which makes the Web Services incredibly easy to work with and maintain. Apart from that the suggested concept of designing hypermedia-driven RESTful APIs was taken into account too. At the end data records can be retrieved in a different format (MIME types) such as JSON, JSONP or XML along with a set of links pointing to accessible resources. Please see [HATEOAS](http://spring.io/understanding/HATEOAS) for more information.

### 3. Mobile version
For some reason I was feeling an affinity to the [Apache Cordova](http://cordova.apache.org) framework when making a decision regarding building the application for the Android platform. This part was, however, a bit tricky and made me thinking for a certain period of time as building a desktop SPA involves following slightly different rules as compared to how SPAs can be developed as a desktop solution. Well, this part gave me a proper lesson, no question about that :-)

### 4. Middleware
To make the given solution open to a further enterprise integration, [Apache ServiceMix](http://servicemix.apache.org) along with [Apache ActiveMQ](http://activemq.apache.org) were set up appropriately. Having said that not only web clients can communicate with the backend using, for instance, the [STOMP](http://stomp.github.io) or [MQTT](http://mqtt.org) protocol over [WebSockets](http://www.websockets.org). Furthermore, some parts of the business logic can be added on demand using hot deployment which is a great feature when building 100% [SOA]((http://en.wikipedia.org/wiki/Service-oriented_architecture)) applications consisting of loosely-coupled components. In this sense ServiceMix can act as an additional runtime that some business modules can be deployed onto. Clients can then interact with the server-side logic via RESTful APIs, SOAP endpoints or [MDBs](http://docs.oracle.com/javaee/7/tutorial/doc/ejb-intro003.htm) (Message-Driven Beans). To put it other words, such a concept nicely taps the SOA approach on the shoulder :-)

### 5. [BPM](http://en.wikipedia.org/wiki/Business_process_management)
Even though I am a novice in the BPM field, the [Activiti.org](http://activiti.org) framework can be quickly integrated into ServiceMix when required.

### 6. Possible improvements
Given the Twitter Bootstrap, the [IonicUI](http://ionicframework.com) framework or just the Angular ui-bootstrap module could be a better choice since they both have been designed with AngularJS in mind and do not therefore require the jQuery library to be included as a dependency.

When it comes to building real-time SPA applications, I am about to replace the ActiveMQ message broker with RabbitMQ as it looks easier to get integrated with the Atmosphere framework using a Spring XML descriptor.

Regarding the communication with REST APIs, the Restangular module is generally considered to be a more suitable solution as compared to the native ngResource module and I'm looking forward to giving it a try soon.

As far as the integration stuff is concerned, [Mule ESB](https://www.mulesoft.org), [Apache Camel](http://camel.apache.org) or [Spring EIP](http://projects.spring.io/spring-integration/) might be worth a further consideration as they all provide a number of useful EIPs (Enterprise Integration Patterns) applicable on the backend.

Last but not least, to build the entire application using only JavaScript syntax, [Meteor.js](https://meteor.com) or a combination of Node.js and Express would be probably the best choice available to full-stack JavaScript developers these days I assume. However, my intention was to split my skills between a hybrid JavaScript and pure object-oriented Java :-)

### 7. Inspiration

Here is the list of video tutorials I have watched recently as acquiring new techniques become always handy:

* [Angular Best Practices](http://avaxhome.cc/ebooks/eLearning/Pluralsight_Angular_Best_Practices.html) (2013)
* [Building apps with Angular and Breeze](http://avaxhome.cc/ebooks/programming_development/html_css_js_javascript/PluralsightBuildingAppswithAngularandBreeze2013.html) (2013)
* [How to build a hypermedia-driven REST API](http://avaxhome.cc/ebooks/eLearning/Tutsplus_How_to_Build_a_Hypermedia_Driven_REST_API.html) (2014)
