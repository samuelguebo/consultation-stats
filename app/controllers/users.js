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
      SELECT DISTINCT a.actor_name,
      ( select count(*) from revision_userindex r
      where r.rev_actor = a.actor_id
      and r.rev_timestamp > (now() - INTERVAL 15 DAY + 0)
      ) as total, p.page_id

      FROM revision_userindex r
      LEFT JOIN page p ON r.rev_page = p.page_id
      LEFT JOIN actor a on r.rev_actor = a.actor_id
      WHERE p.page_id = ? LIMIT 3;
      `
        .replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
        .replace(/\s+/g, " ") // get rid of superflous spaces
        .trim(); // no space before or at the end

      con.query(sqlQuery, [pageId], function (error, result, fields) {
        if (error) throw error;
        res.send(result);
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
