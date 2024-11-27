/**
 * Created by pradeepkadiyala on 6/14/18.
 */

 import * as ConnectRoles from 'connect-roles';
 import * as _ from 'lodash';

 let roles = new ConnectRoles({
  failureHandler: function failureHandler(req, res, action) {
    res.status(403);
    res.json({message: 'Unauthorized', action: action});
  },
  async: true,
  matchRelativePaths: true
});

roles.use('authenticated', function authenticatedCallback(req) {
  return req.isAuthenticated();
});

export default roles;
