/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2018 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

var eventMappingsMap = {
};

export function getEventHandler(eventType: string) {
  return eventMappingsMap[eventType];
}
