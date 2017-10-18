package info.smartkit.shiny.guide.controllers;

import info.smartkit.shiny.guide.dao.ConsultInfoDao;
import info.smartkit.shiny.guide.dao.UserInfoDao;
import info.smartkit.shiny.guide.dto.JsonObject;
import info.smartkit.shiny.guide.vo.ConsultInfo;
import info.smartkit.shiny.guide.vo.UserInfo;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.ws.rs.core.MediaType;

/**
 * Created by smartkit on 27/02/2017.
 */
@RestController
// @see: http://spring.io/guides/gs/reactor-thumbnailer/
@RequestMapping(value = "/consult")
public class ConsultInfoController {

    @Autowired
    private ConsultInfoDao DAO;

    /**
     * Posting anew ConsultInfo
     *
     * @param DAO
     * @return Response a string describing if the user info is successfully created or not.
     */
    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON)
    @ApiOperation(httpMethod = "POST", value = "Response a string describing if the user info is successfully created or not.")
    public JsonObject create(@RequestBody @Valid ConsultInfo info) {
        return new JsonObject(DAO.save(info));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ApiOperation(httpMethod = "GET", value = "Response a string describing if the user info id is successfully get or not.")
    public JsonObject get(@PathVariable("id") long id) {
        return new JsonObject(this.DAO.findOne(id));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ApiOperation(httpMethod = "DELETE", value = "Response a string describing if the user info is successfully delete or not.")
    public JsonObject delete(@PathVariable("id") long id) {
        try {
            this.DAO.delete(id);
        } catch (Exception e) {
            return new JsonObject(e.toString());
        }
        return new JsonObject(new ResponseEntity<Boolean>(Boolean.TRUE, HttpStatus.OK));
    }

    @RequestMapping(method = RequestMethod.GET)
    @ApiOperation(httpMethod = "GET", value = "Response a list describing all of user info that is successfully get or not.")
    public JsonObject list() {
//		return new JsonObject(this._alarmInfoDao.findAll());
        return new JsonObject(this.DAO.findAll());
    }

    @RequestMapping(value = "/{id}/iid/{iid}/pid/{pid}", method = RequestMethod.PUT)//
    @ApiOperation(httpMethod = "PUT", value = "Response a string describing if the consult info is successfully patched or not.")
    public JsonObject patch(@PathVariable("id") long id, @PathVariable("iid") int iid, @PathVariable("pid") int pid) {
        ConsultInfo find = this.DAO.findOne(id);
        find.setIid(iid);
        find.setPid(pid);
        return new JsonObject(this.DAO.save(find));
    }
}