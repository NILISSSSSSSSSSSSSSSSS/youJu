

let notifyNames = Object.create(null);

/**
 *
 * @type {{name:[{o:object,c:string}]}}
 */
class NotificationMethod {
  /**
   *
   * @param {object}observer
   * @param {string}callback --- function(name, userInfo)
   * @param {string}name
   */
  // 注册通知
  static addObserver(observer, callback, name) {
    if (notifyNames[name] === undefined) {
      notifyNames[name] = [];
      notifyNames[name + '_cnt'] = 0;
    }
    
    var pos = notifyNames[name].length;
    for (var i = 0; i < notifyNames[name].length; ++i) {
      if (i in notifyNames[name] && notifyNames[name][i] === undefined) {
        pos = i;
        continue;
      }
      if (i in notifyNames[name] && notifyNames[name][i] != undefined) {
        if (notifyNames[name][i]['o'] === observer) {
          notifyNames[name][i]['c'] = callback;
          notifyNames = notifyNames;
          return;
        }
      }
    }
    notifyNames[name][pos] = {'o': observer, 'c': callback};
    notifyNames[name + '_cnt'] += 1;
    notifyNames = notifyNames;
  }
  
  // 移除view的指定通知
  static removeObserver(observer, name) {
    if (notifyNames[name] === undefined) {
      return;
    }
    
    for (var i = 0; i < notifyNames[name].length; ++i) {
      if (i in notifyNames[name] && notifyNames[name][i] != undefined) {
        if (notifyNames[name][i]['o'] === observer) {
          notifyNames[name][i] = undefined;
          notifyNames[name + '_cnt'] -= 1;
          notifyNames = notifyNames;
          
          if (notifyNames[name + '_cnt'] == 0) {
            delete notifyNames[name + '_cnt'];
            delete notifyNames[name];
            notifyNames = notifyNames;
          }
          return;
        }
      }
    }
  }
  
  // 移除当前view的所有通知
  static removeObserverAllNotification(observer) {
    for (var name in notifyNames) {
      if (typeof notifyNames[name] != 'object') {
        continue;
      }
      this.removeObserver(observer, name);
    }
  }
  
  // 发送通知
  // 参数类型：
  // name：通知名称
  // userInfo：传递的信息
  static postNotification(name, userInfo) {
    if (notifyNames[name] === undefined) {
      return;
    }
    
    for (var i = 0; i < notifyNames[name].length; ++i) {
      if (i in notifyNames[name] && notifyNames[name][i] != undefined) {
        if (typeof notifyNames[name][i]['o'] === 'object'
            && typeof notifyNames[name][i]['o'][notifyNames[name][i]['c']] === 'function') {
          notifyNames[name][i]['o'][notifyNames[name][i]['c']](name, userInfo);
        } else {
          if(typeof notifyNames[name][i]['c'] === 'function' && typeof(eval(notifyNames[name][i]['c']))=="function") {
            notifyNames[name][i]['c'](name, userInfo);
          }
        }
      }
    }
  }
  
  // 同步发送通知，暂时用不上
  static postNotificationAsync (name, userInfo) {
    setTimeout(function () {
      if (notifyNames[name] === undefined) {
        return;
      }
      
      for (var i = 0; i < notifyNames[name].length; ++i) {
        if (i in notifyNames[name] && notifyNames[name][i] != undefined) {
          if (typeof notifyNames[name][i]['o'] === 'object'
              && typeof notifyNames[name][i]['o'][notifyNames[name][i]['c']] === 'function') {
            notifyNames[name][i]['o'][notifyNames[name][i]['c']](name, userInfo);
          } else {
            notifyNames[name][i]['c'](name, userInfo);
          }
        }
      }
    }, 0);
  }
}

export class Notification {
  addObserver(observer, callback, name) {
    NotificationMethod.addObserver(observer, callback, name);
  }
  
  removeObserver(observer, name) {
    NotificationMethod.removeObserver(observer, name);
  }
  
  removeObserverAllNotification(observer) {
    NotificationMethod.removeObserverAllNotification(observer);
  }
  
  postNotification(name, userInfo) {
    NotificationMethod.postNotification(name, userInfo);
  }
  
  postNotificationAsync(name, userInfo) {
    NotificationMethod.postNotificationAsync(name, userInfo);
  }
}


