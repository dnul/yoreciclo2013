package controllers;

import models.User;
import play.mvc.Controller;
import play.mvc.Http.Session;
import play.mvc.Result;
import views.html.index;
import views.html.registration;
import views.html.header;
import views.html.footer;
import views.html.docHead;
import views.html.maps;


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

    public static Result header() {
    	return ok(header.render());
    }

    public static Result footer() {
        return ok(footer.render());
    }

    public static Result docHead() {
        return ok(docHead.render());
    }
    
    public static Result maps() {
        return ok(maps.render());
    }
}
