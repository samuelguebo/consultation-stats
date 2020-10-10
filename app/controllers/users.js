const express = require("express");
const mysql = require("mysql");
const settings = require("../settings");
const validator = require("validator");
const router = express.Router();

/**
 * Method matching route /users/wikiDb/pageId
 * It users a SQL query and fetched data
 * from replicas.
 *
 * @return {Response} Json response
 */
router.get("/users/:wikiDb/:pageId", function (req, res) {
  try {
    let wikiDb = req.params.wikiDb;
    let pageId = req.params.pageId;

    // Initial sanitization, can be refined later
    if (!validator.contains(wikiDb, "_p") || !validator.isNumeric(pageId)) {
      throw false;
    }

    const con = mysql.createConnection({
      host: settings.host,
      user: settings.user,
      password: settings.password,
      database: wikiDb,
      port: settings.port,
      typeCast: function (field, next) {
        if (field.type == "VAR_STRING") {
          return field.string();
        }
        return next();
      },
    });

    con.connect(function (error) {
      let sqlQuery = ` 
      SELECT gu_name, gu_name, gu_home_db, gu_registration, gug_group,
      ( SELECT count(*) from revision_userindex
          WHERE rev_actor = actor_id
          AND rev_timestamp > (now() - INTERVAL 15 DAY + 0)
      ) AS total
      FROM centralauth_p.global_user_groups
      LEFT JOIN centralauth_p.globaluser ON gug_user = gu_id 
      LEFT JOIN actor on actor_name = gu_name

      WHERE gu_name in (
          SELECT DISTINCT actor_name
          FROM revision_userindex
          WHERE rev_page = ?
      );
      `
        .replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
        .replace(/\s+/g, " ") // get rid of superflous spaces
        .trim(); // no space before or at the end

      con.query(sqlQuery, [pageId], function (error, results, fields) {

        if (error) throw error;
        //res.send(results);

        res.send({
          "results": results
        })
      });
    });
    //res.send([wiki, pageId])
  } catch (error) {
    res.send({
      error: error,
    });
  }
});

module.exports = router;