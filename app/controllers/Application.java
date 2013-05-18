package controllers;

import models.User;
import play.mvc.Controller;
import play.mvc.Http.Session;
import play.mvc.Result;
import views.html.index;
import views.html.registration;

import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.user.AuthUser;

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
  

	public static Result registration() {
	    return ok(registration.render());
	}
}
