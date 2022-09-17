package com.example.fullstack;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class GreetingResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/hello")
          .then()
             .statusCode(200)
             .body(is("Hello Quarkus live coding!"));
    }

    @Test
    public void testHelloWorldEndpoint() {
        given()
          .when().get("/hello/world")
          .then()
          .statusCode(200)
          .body(is("Hello world!"));
    }

}
