Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }
});

// The key difference between this waitOn method and what we had before 
// (when the subscription was in main.js, which should now be empty 
// and can be removed), is that now Iron Router knows when the route is "ready" -- 
// that is, when the route has the data it needs to render.
Router.route('/', {
  name: 'postsList'
});
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { 
    return Posts.findOne(this.params._id); 
  }
});
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {
  name: 'postSubmit'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});