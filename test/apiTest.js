const axios = require("axios");
const { expect } = require("chai");

describe("Login API", function () {
  it("should log in successfully with valid credentials and have tokens issued", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  });
  it("should not log in successfully with invalid credentials", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "wrongpassword",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).to.be.oneOf([401, 403]);
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
    }
  });
  it("should log in successfully with random capitalizations in email with valid credentials and have tokens issued", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@tEst.cOm",
      password: "password",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  });
  it("should not log in successfully with different cased passwords", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "paSSwORd",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).to.be.oneOf([401, 403]);
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
    }
  });
});

describe("Registration API", function () {
  it("should not register successfully with an email already in use", async function () {
    const apiUrl = "http://localhost:3000/api/auth/signup";
    const requestData = {
      name: "Fred",
      email: "123@test.com",
      password: "password",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([400, 403]);
      expect(error.response).to.have.property("data");
    }
  });
  it("should not register successfully with an email already in use with different capitalization", async function () {
    const apiUrl = "http://localhost:3000/api/auth/signup";
    const requestData = {
      name: "Fred",
      email: "123@TEST.com",
      password: "password",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([400, 403]);
      expect(error.response).to.have.property("data");
    }
  });
  it("should not register successfully with empty fields", async function () {
    const apiUrl = "http://localhost:3000/api/auth/signup";
    const requestData = {
      name: "Fred",
      email: "jake@test.com",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([400, 401]);
      expect(error.response).to.have.property("data");
    }
  });
  it("should register successfully with valid credentials", async function () {
    const apiUrl = "http://localhost:3000/api/auth/signup";
    const requestData = {
      name: "Johnny Test",
      email: "Johnny15@test.com",
      password: "password",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status).to.be.oneOf([200, 201]);
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  });
});

describe("Logging in after registration", function () {
  it("should log in successfully with newly registered account", async function () {
    const registrationUrl = "http://localhost:3000/api/auth/signup";
    const registrationRequestData = {
      name: "Johnny Test",
      email: "Johnny25@test.com",
      password: "password",
    };

    try {
      const response = await axios.post(
        registrationUrl,
        registrationRequestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(response.status).to.be.oneOf([200, 201]);
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    } finally {
      const loginUrl = "http://localhost:3000/api/auth/login";
      const loginRquestData = {
        email: "joHNny25@test.com",
        password: "password",
      };

      try {
        const response = await axios.post(loginUrl, loginRquestData, {
          headers: { "Content-Type": "application/json" },
        });
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.data).to.have.property("accessToken");
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    }
  });
});

describe("getNotes", function () {
  it("should get the notes after successful login", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          //  'Authorization': `Bearer`
        },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      console.log(error);
      throw new Error(`Login failed: ${error.message}`);
    } finally {
      const noteApi = "http://localhost:3000/api/notes";
      const noteResponse = await axios.get(noteApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });
      expect(noteResponse.data).to.be.an("array").that.is.not.empty;
    }
  });

  it("should get a specific note after successful login", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    } finally {
      const noteApi = "http://localhost:3000/api/notes/2";
      const noteResponse = await axios.get(noteApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(noteResponse.data.id).to.equal(2);
      expect(noteResponse.data.contents).to.equal(
        "Remeber to hash passwords for security"
      );
    }
  });

  it("should get not a specific note for another user", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "marco@polo.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const noteApi = "http://localhost:3000/api/notes/2";
      const noteResponse = await axios.get(noteApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });
      expect(noteResponse.data).to.equal("no notes found for user");
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
    }
  });

  it("should get a note after note being created", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const noteApi = "http://localhost:3000/api/notes/";
      const postedNote = {
        note: "Will Grigg is on fire!",
      };
      const noteResponse = await axios.post(noteApi, postedNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      const getNotesUrl = `http://localhost:3000/api/notes/${noteResponse.data.id}`;
      const receivedNote = await axios.get(getNotesUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(receivedNote.data.id).to.equal(noteResponse.data.id);
      expect(receivedNote.data.contents).to.equal(postedNote.note);
    } catch (error) {
      throw new Error(`Posting failed: ${error.message}`);
    }
  });
});

describe("updateNotes", function () {
  it("should update note with proper authentication", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const noteApi = "http://localhost:3000/api/notes/";
      const postedNote = {
        note: "Will Grigg is on fire!",
      };
      const noteResponse = await axios.post(noteApi, postedNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      const update = {
        note: "Your defense is terrified",
      };

      const getNotesUrl = `http://localhost:3000/api/notes/${noteResponse.data.id}`;
      await axios.put(getNotesUrl, update, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      const updatedNote = await axios.get(getNotesUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(updatedNote.data.contents).to.equal(update.note);
      expect(updatedNote.data.id).to.equal(noteResponse.data.id);
    } catch (error) {
      throw new Error(`Posting failed: ${error.message}`);
    }
  });
  it("should not update note with improper authentication", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login/";
    const requestData = {
      email: "marco@polo.com",
      password: "password",
    };

    let authcode;

    const update = {
      note: "Your defense is terrified",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    try {
      const noteUrl = "http://localhost:3000/api/notes/2";

      const reply = await axios.put(noteUrl, update, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authcode}`,
        },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
      expect(error.response.statusText).to.equal("Unauthorized");
    }
  });

  it("should not update note with invalid number", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login/";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };

    let authcode;

    const update = {
      note: "Your defense is terrified",
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    try {
      const noteUrl = "http://localhost:3000/api/notes/9999";
      const reply = await axios.put(noteUrl, update, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authcode}`,
        },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
      expect(error.response.statusText).to.equal("Unauthorized");
    }
  });
});

describe("deleteNotes", function () {
  it("should not delete note with invalid authentication", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login/";
    const requestData = {
      email: "marco@polo.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    try {
      const noteUrl = "http://localhost:3000/api/notes/2";
      const reply = await axios.delete(noteUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authcode}`,
        },
      });
    } catch (error) {
      expect(error.response.status).to.be.oneOf([401, 403]);
      expect(error.response.statusText).to.equal("Unauthorized");
    }
  });

  it("should delete a note with proper authentication", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;
    let noteId;
    let notePendingDeletion;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const noteApi = "http://localhost:3000/api/notes/";
      const postedNote = {
        note: "Will Grigg is on fire!",
      };
      const noteResponse = await axios.post(noteApi, postedNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      noteId = noteResponse.data.id;

      const getNotesUrl = `http://localhost:3000/api/notes/${noteId}`;
      notePendingDeletion = await axios.get(getNotesUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(notePendingDeletion.data.id).to.equal(noteId);
      expect(notePendingDeletion.data.contents).to.equal(postedNote.note);
    } catch (error) {
      throw new Error(`Posting failed: ${error.message}`);
    }

    try {
      const getNotesUrl = `http://localhost:3000/api/notes/${noteId}`;
      const deletedNote = await axios.delete(getNotesUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });
      expect(deletedNote.status).to.equal(200);
      expect(deletedNote.data).to.deep.equal(notePendingDeletion.data);
    } catch (error) {
      throw new Error(`Deletion failed: ${error.message}`);
    }

    try {
      const getNotesUrl = `http://localhost:3000/api/notes/${noteId}`;
      const searchResult = await axios.get(getNotesUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(searchResult.status).to.equal(200);
      expect(searchResult.data).to.equal("no notes found for user");

      // now we search for same noteId it should no longer return a result;
    } catch (error) {
      console.log(error);
      throw new Error(`Deletion failed: ${error.message}`);
    }
  });
});

describe("searchNotes", function () {
  it("should search note with proper authentication", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const searchUrl = "http://localhost:3000/api/search?q=package";
      const searchResults = await axios.get(searchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(searchResults.data[0].contents).to.include("package");
    } catch (error) {
      throw new Error(`Posting failed: ${error.message}`);
    }
  });

  it("should not find note with incorrect search terms", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "123@test.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");
      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const searchUrl =
        "http://localhost:3000/api/search?q=correcthorsebatterystaple";
      const searchResults = await axios.get(searchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });

      expect(searchResults.data).to.be.an("array").that.is.empty;
    } catch (error) {
      throw new Error(`Posting failed: ${error.message}`);
    }
  });

  it("should not find note with improper authentication", async function () {
    const apiUrl = "http://localhost:3000/api/auth/login";
    const requestData = {
      email: "marco@polo.com",
      password: "password",
    };
    let authcode;

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).to.be.oneOf([200, 201]);

      expect(response.data).to.have.property("accessToken");

      authcode = response.data.accessToken;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    try {
      const searchUrl = "http://localhost:3000/api/search?q=package";
      const searchResults = await axios.get(searchUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authcode}`,
        },
      });
      expect(searchResults.data).to.be.an("array").that.is.empty;
    } catch (error) {
      throw new Error(`Posting failed: ${error.message}`);
    }
  });
});
