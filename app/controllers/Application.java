package controllers;

import models.User;

import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.user.AuthUser;

import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.Session;
import views.html.index;

public class Application extends Controller {
  
    public static Result index() {
    	
    	AuthUser user = PlayAuthenticate.getUser(session());
    	User appUser = User.findByAuthUserIdentity(user);
    	
        return ok(index.render("Your new application is ready.",appUser));
    }
    
    public static Result oAuthDenied(final String providerKey) {
        flash("flash",
                "You need to accept the OAuth connection in order to use this website!");
        return redirect(routes.Application.index());
    }
    
	public static User getLocalUser(final Session session) {
		final AuthUser currentAuthUser = PlayAuthenticate.getUser(session);
		final User localUser = User.findByAuthUserIdentity(currentAuthUser);
		return localUser;
	}
  
}
