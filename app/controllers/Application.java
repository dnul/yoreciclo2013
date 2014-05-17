package controllers;

import java.util.ArrayList;
import java.util.List;

import models.User;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.JsonNodeFactory;
import org.codehaus.jackson.node.ObjectNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http.Session;
import play.mvc.Result;
import views.html.docHead;
import views.html.footer;
import views.html.header;
import views.html.indexbootstrap;
import views.html.maps;
import views.html.mapsHome;
import views.html.registration;

import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.user.AuthUser;

public class Application extends Controller {
  
    public static Result index() {
    	
    	AuthUser user = PlayAuthenticate.getUser(session());
    	User appUser = User.findByAuthUserIdentity(user);
    	
        return ok(indexbootstrap.render(appUser));
    }
    
public static Result indexHackathon() {
    	
    	AuthUser user = PlayAuthenticate.getUser(session());
    	User appUser = User.findByAuthUserIdentity(user);
    	
        return ok(views.html.indexhackathon.render(appUser));
    }
    
    public static Result oAuthDenied(final String providerKey) {
        flash("flash",
                "You need to accept the OAuth connection in order to use this website!");
        return redirect(routes.Application.index());
    }
    
    public static Result getCurrentUser(){
    	final AuthUser currentAuthUser = PlayAuthenticate.getUser(session());
		final User localUser = User.findByAuthUserIdentity(currentAuthUser);
		JsonNode json = Json.toJson(localUser);
		return ok(json);
    }
	public static User getLocalUser(final Session session) {
		final AuthUser currentAuthUser = PlayAuthenticate.getUser(session);
		final User localUser = User.findByAuthUserIdentity(currentAuthUser);
		return localUser;
	}
	
	public static Result registeredUsers() {
		ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.instance);

		List<User> all = User.find.all();
		for (User u : all) {
			ObjectNode newObject = Json.newObject();
			newObject.put("recycledItems", u.recycledItems);
			newObject.put("name", u.name);
			newObject.put("facebookId",
					u.linkedAccounts.get(0).providerUserId);
			arrayNode.add(newObject);
			newObject.put("lat", u.lat);
			newObject.put("lon", u.lon);
		}
		return ok(arrayNode);
	}
	

	public static Result registration() {
		AuthUser user = PlayAuthenticate.getUser(session());
    	User appUser = User.findByAuthUserIdentity(user);
    	
        return ok(indexbootstrap.render(appUser));
	}
	
	public static Result submitAddress(){
		JsonNode asJson = request().body().asJson();
		AuthUser user = PlayAuthenticate.getUser(session());
		final User localUser = User.findByAuthUserIdentity(user);
		ArrayNode array = (ArrayNode) asJson;
		String lat= array.get(0).asText();
		String lng= array.get(1).asText();
		localUser.lat=lat;
		localUser.lon=lng;
		localUser.save();
		return ok();
	}
	
	public static Result submitMaterials(){
		JsonNode asJson = request().body().asJson();
		AuthUser user = PlayAuthenticate.getUser(session());
		final User localUser = User.findByAuthUserIdentity(user);
		List<String> materials= new ArrayList<String>();
		
		JsonNode array = (JsonNode) asJson;
		if(array.get("vi")!=null){
			materials.add("vi");
		}
		if(array.get("pl")!=null){
			materials.add("pl");
		}
		if(array.get("ca")!=null){
			materials.add("ca");
		}
		if(array.get("me")!=null){
			materials.add("me");
		}
		
		localUser.recycledItems=materials.toString();;
		localUser.save();
		return ok();
	}
	
	public static Result registrationOld() {
		AuthUser user = PlayAuthenticate.getUser(session());
    	User appUser = User.findByAuthUserIdentity(user);
    	
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
    
    public static Result mapsHome() {
        return ok(mapsHome.render());
    }
}
