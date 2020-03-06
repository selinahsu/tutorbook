# Utilities

We provide a large set of utilities in this repository under `utils/`. Outlined
below are some of the more important ones.

## Data Utilities

We provide a set of utilities for creating new locations, website configurations
(for web app subdomains/partitions), users, and access configurations (i.e.
school districts) in `utils/data/`.

**Note:** Each of these scripts accept array input as comma separated values
(e.g. to populate a user's `subjects`, respond with `Chemistry H, Chemistry`).

### Districts

To create a new school district (or `access` partition), run:

```
$ node district.js
```

This will ask you a couple of questions to populate the district's Firestore
document:

- What is the school district's name?
- What is it's symbol (typically an abbreviation of the name)?
- What email domains are allowed at this school district?

### Websites

To create a new website configuration, run:

```
$ node website.js
```

This will ask you a couple of questions to populate the location's Firestore
document:

- What is the website's URL?
- What grades can be selected at this website?
- What locations are shown on this website?
- What district (or `access`) is this website a part of?

### Locations

To create a new location, run:

```
$ node location.js
```

This will ask you a couple of questions to populate the location's Firestore
document:

- What is the location's name?
- What is it's description?
- When is it open?
- Who can supervise it (find users by name or email)?
- What is it's service hour rounding rules?
- What district (or `access`) is this location a part of?

### Users

To create a new user (both their Firestore document and Firebase Authentication
account), run:

```
$ node user.js
```

This will ask you a couple of questions to populate the user's Firestore
document (and Firebase Authentication account):

- What is this user's name?
- Is this user a supervisor, tutor, or pupil?
- What is their email? Phone? Gender? Grade?
- What subjects does this user have?
- When is this user available?
- Is this a paid user? If so, what is their hourly rate?
- What district (or `access`) is this user a part of?

## Migration Utilities

The utilities included in `utils/migrate` are mostly for one-time-use to migrate
older data structures to work with newer code (e.g. renaming a field or naming
Firestore user documents by Firebase Authentication user ID instead of email).