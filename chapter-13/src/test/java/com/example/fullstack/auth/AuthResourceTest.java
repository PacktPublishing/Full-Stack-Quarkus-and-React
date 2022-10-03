package com.example.fullstack.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;

@QuarkusTest
class AuthResourceTest {

  @Test
  void loginValidCredentials() {
    given()
      .body("{\"name\":\"admin\",\"password\":\"quarkus\"}")
      .contentType(ContentType.JSON)
      .when().post("/api/v1/auth/login")
      .then()
      .statusCode(200)
      .body(not(emptyString()));
  }

  @Test
  void loginInvalidCredentials() {
    given()
      .body("{\"name\":\"admin\",\"password\":\"not-quarkus\"}")
      .contentType(ContentType.JSON)
      .when().post("/api/v1/auth/login")
      .then()
      .statusCode(401);
  }
}
