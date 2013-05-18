package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.registration;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render("Your new application is ready."));
    }
    
    public static Result oAuthDenied(final String providerKey) {
        flash("flash",
                "You need to accept the OAuth connection in order to use this website!");
        return redirect(routes.Application.index());
    }

	public static Result registration() {
	    return ok(registration.render());
	}
}
