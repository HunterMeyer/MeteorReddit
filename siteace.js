Websites = new Mongo.Collection('websites');
Votes = new Mongo.Collection('votes');

if (Meteor.isClient) {

  Template.registerHelper('formatDate', function(date) {
    return moment(date).fromNow();
  });

  Template.website_list.helpers({
    websites: function(){
      return Websites.find({}, { sort: { rating: -1 } });
    }
  });

  Template.website_item.helpers({
    postedBy: function(website_id) {
      var created_by_id = Websites.findOne({ _id: website_id }).created_by_id;
      if (created_by_id) {
        return Meteor.users.findOne({ _id: created_by_id }).username
      } else {
        return 'anon'
      }
    },
    upvotes: function(website_id) {
      return Votes.find({ websiteId: website_id, direction: 1 }).count();
    },
    downvotes: function(website_id) {
      return Votes.find({ websiteId: website_id, direction: -1 }).count();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  var incrementWebsiteRating = function(website_id) {
    var votes = Votes.find({ websiteId: website_id });
    var rating = 0;
    if (votes.count() > 0) {
      votes.map(function(vote) { rating += vote.direction; });
    }
    Websites.update({ _id: website_id }, { $set: { rating: rating } });
  }

  Template.website_item.events({
    'click .js-upvote': function(event){
      var website_id = this._id;

      if (Meteor.user()) {
        var currentVote = Votes.findOne({ userId: Meteor.user()._id, websiteId: website_id });
        if (currentVote) {
          if (currentVote.direction === 1) {
            Votes.remove({ _id: currentVote._id });
          } else {
            Votes.update({ _id: currentVote._id }, { $set: { direction: 1 } });
          }
        } else {
          Votes.insert({ userId: Meteor.user()._id, websiteId: website_id, direction: 1 });
        }
        incrementWebsiteRating(website_id);
      } else {
        $(event.target).parent().siblings('.vote-error').text('You must login to vote...');
      }
      return false
    }, 
    'click .js-downvote': function(event){
      var website_id = this._id;

      if (Meteor.user()) {
        var currentVote = Votes.findOne({ userId: Meteor.user()._id, websiteId: website_id });
        if (currentVote) {
          if (currentVote.direction === -1) {
            Votes.remove({ _id: currentVote._id });
          } else {
            Votes.update({ _id: currentVote._id }, { $set: { direction: -1 } });
          }
        } else {
          Votes.insert({ userId: Meteor.user()._id, websiteId: website_id, direction: -1 });
        }
        incrementWebsiteRating(website_id);
      } else {
        $(event.target).parent().siblings('.vote-error').text('You must login to vote...');
      }
      return false;
    }
  });

  Template.website_form.events({
    'submit .js-save-website-form': function(event){
      var title = event.target.title.value;
      var url = event.target.url.value;
      var desc = event.target.description.value;
      var user = Meteor.user();
      if (user) {
        Websites.insert({
          title: title,
          url: url,
          description: desc,
          createdOn: new Date(),
          created_by_id: user._id,
          rating: 0
        });
      }
      $('.website-add-button').removeClass('open');
      event.target.reset();
      return false;
    }
  });
}
