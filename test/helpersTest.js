require("dotenv").config();
const { assert } = require("chai");
const expect = require('chai').expect;
const { getUserWithEmail } = require("../server/db/queries/login");
const { Pool } = require("pg");
const { addUser } = require("../server/db/queries/addUser");
const { addNote } = require("../server/db/queries/addNote");
const { getNotesById, getNotesForUser, getSharedNote } = require("../server/db/queries/getNotes");
const { removeNote } = require("../server/db/queries/removeNote");
const { updateNote, shareNote } = require("../server/db/queries/updateNote");
const { searchNotes } = require("../server/db/queries/searchNotes");

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const db = new Pool(dbParams);

db.connect().catch((e) =>
  console.log(`Error connecting to Postgres server:\n${e}`)
);

const testUsers = {
  validUser: {
    id: 1,
    name: "Bobby",
    password: "$2a$10$Ayj/GV1Etys.d4O/rt0ICOp0vDtSTE3PYdVaROqFgpnAtA0RlJVQy",
    email: "123@test.com",
  },
  user2RandomID: {
    id: 2,
    name: "Mikey",
    password: "$2a$10$Ayj/GV1Etys.d4O/rt0ICOp0vDtSTE3PYdVaROqFgpnAtA0RlJVQy",
    email: "123@test.com",
  },
};

describe("getUserWithEmail", function () {
  it("should return a user with valid email", async function () {
    const expectedUser = await getUserWithEmail("123@test.com");
    const expectedUserID = "validUser";
    assert.deepEqual(expectedUser, testUsers[expectedUserID]);
  });

  it("should return undefined with an invalid email", async function () {
    const user = await getUserWithEmail("user@example.com");
    expect(user).to.be.undefined;
  });
});

describe("addUser", function () {
  it("should add a user with a valid email and password", async function () {
    const newUser = {
      name: "Mikey",
      password: "password",
      email: "michael@test.com",
    };

    const addedUser = await addUser(newUser);
    assert.equal(newUser.name, addedUser.name);
    assert.equal(newUser.password, addedUser.password);
    assert.equal(newUser.email, addedUser.email);
  });
});

describe("getNotesById", function () {
  it("should get a note given an id", async function () {
    const note = {
      id: 2,
      owner_id: 1,
      contents: "Remeber to hash passwords for security"
    };
    const retrievedNote = await getNotesById(1, 2);
    assert.equal(note.id, retrievedNote.id);
    assert.equal(note.owner_id, retrievedNote.owner_id);
    assert.equal(note.contents, retrievedNote.contents)
  });

  it("should return null given an invalid id", async function () {
    const note = {
      id: 2,
      owner_id: 1,
      contents: "Remeber to hash passwords for security"
    };
    const retrievedNote = await getNotesById(1, 999);
    expect(retrievedNote).to.be.null;
  });
});

describe("getNotesForUser", function () {
  it("should get a note given an owner id", async function () {
    const note = {
      id: 2,
      owner_id: 1,
      contents: "Remeber to hash passwords for security"
    };
    const retrievedNotes = await getNotesForUser(1);
    assert.isAtLeast(retrievedNotes.length, 2, "There are at least 2 notes created from seeds");
    assert.equal(note.owner_id, retrievedNotes[1].owner_id);
    assert.equal(note.contents, retrievedNotes[1].contents);
  });

  it("should not get a note given an invalid owner id", async function () {
    const retrievedNotes = await getNotesForUser(999);
    assert.equal(retrievedNotes, null);
  });
});

describe("getSharedNote", function() {
  it("should get a note with share enabled", async function () {
    const sharedNote = await getSharedNote(3);

    assert.equal(sharedNote.id, 3);
    assert.equal(sharedNote.contents, 'Sharing is caring');
  })

  it("should not get a note with share disabled", async function () {
    const sharedNote = await getSharedNote(2);

    assert.equal(sharedNote, null);
  })
})

describe("addNote", function () {
  it("should add a note", async function () {
    const newNote = {
      owner_id: 1,
      contents: "I am happy!",
    };

    const retrievedNotes = await getNotesForUser(1);
    const addedNote = await addNote(1, newNote.contents);
    const retrievedNewNotes = await getNotesForUser(1);

    assert.equal(newNote.owner_id, addedNote.owner_id);
    assert.equal(newNote.contents, addedNote.contents);
    assert.equal(retrievedNotes.length + 1, retrievedNewNotes.length)
  });
});

describe("removeNote", function () {
  it("should remove a valid note", async function () {
    const retrievedNotes = await getNotesForUser(1);
    const finalNote = await getNotesById(1, retrievedNotes[retrievedNotes.length-1].id);
    const deletedNote = await removeNote(1, finalNote.id);
    const newRetrievedNotes = await getNotesForUser(1);

    assert.equal(retrievedNotes.length -1, newRetrievedNotes.length);
    assert.deepEqual(finalNote, deletedNote);
  });

  it("should not remove a note with invalid parameters", async function () {
    const retrievedNotes = await getNotesForUser(1);
    const finalNote = await getNotesById(1, retrievedNotes[retrievedNotes.length-1].id);
    const deletedNote = await removeNote(1, 999);
    const newRetrievedNotes = await getNotesForUser(1);

    assert.equal(retrievedNotes.length, newRetrievedNotes.length);
    expect(deletedNote).to.be.undefined;
    assert.deepEqual(finalNote, newRetrievedNotes[newRetrievedNotes.length -1]);
  });
});

describe("updateNote", function () {
  it("should update a note", async function () {
    const retrievedNotes = await getNotesForUser(1);
    let notesArray = [...retrievedNotes];
    const modifiedNote = notesArray.pop();
    modifiedNote.contents = 'Let\'s go to the mall!';
    const updatedNote = await updateNote(1, {id: modifiedNote.id, contents: modifiedNote.contents});

    assert.deepEqual(modifiedNote, updatedNote);
  });
});

describe("shareNote", function() {
  it("should update a note's shared status", async function() {
    const newNote = {
      owner_id: 2,
      contents: "I am happy!",
    };
    await addNote(2, newNote.contents);
    const retrievedNewNotes = await getNotesForUser(2);
    const lastNote = retrievedNewNotes[retrievedNewNotes.length - 1]

    assert.equal(lastNote.contents, newNote.contents);
    assert.equal(lastNote.shared, false);  // ensure such note is added and sharing is false

    const sharedNote = await shareNote(2, lastNote.id);
    assert.equal(sharedNote.shared, true);
    assert.equal(sharedNote.id, lastNote.id);
    assert.equal(lastNote.contents, sharedNote.contents);
  })
})

describe("searchNote", function () {
  it("should find a note containing a keyword", async function () {
    const searchResults = await searchNotes(1, "package lock");

    assert.isAtLeast(searchResults.length, 1); // should be only one but leaving it in case seeds are modified or expanded
    assert.include(searchResults[0].contents, "package-lock");
  });

  it("should not find a note containing a made up word", async function () {
    const searchResults = await searchNotes(1, "heswatchingusallwiththeeyeofthetiger");

    assert.equal(searchResults.length, 0);
  });
});