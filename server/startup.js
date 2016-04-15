if (Meteor.isServer) {

  Meteor.startup(function () {
    if(!Meteor.users.findOne()) {
      var newUserId = Meteor.users.insert({
         emails: ['user@example.com'],
         username: 'Anonymouse'
      });
      Accounts.setPassword(newUserId, 'fakepassword32!');
    }
    if (!Websites.findOne()){
      userId = Meteor.users.findOne({ username: 'Anonymouse' })._id;
      Websites.insert({
        title: 'Goldsmiths Computing Department',
        url: 'http://www.gold.ac.uk/computing/',
        description: 'This is where this course was developed.',
        createdOn: new Date(),
        rating: 0,
        created_by_id: userId
      });
      Websites.insert({
        title: 'University of London',
        url: 'http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route',
        description: 'University of London International Programme.',
        createdOn: new Date(),
        rating: 0,
        created_by_id: userId
      });
      Websites.insert({
        title: 'Coursera',
        url: 'http://www.coursera.org',
        description: 'Universal access to the world’s best education.',
        createdOn: new Date(),
        rating: 0,
        created_by_id: userId
      });
      Websites.insert({
        title: 'Google',
        url: 'http://www.google.com',
        description: 'Popular search engine.',
        createdOn: new Date(),
        rating: 0,
        created_by_id: userId
      });
    }
  });
}
