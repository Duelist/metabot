let sinon     = require('sinon')

let testUtil  = requireRoot('utils/test')
let METACOINS = requireRoot('commands/metacoins/constants')

let metacoins = testUtil.rewireRoot('commands/metacoins')



describe('@default', () => {

  it('responds with a user’s metacoin count', function* () {

    // Rewire the metacoins service with a stub for the get metacoins function
    let metacoinsService = metacoins.__get__('metacoins')
    let metacoinsServiceStub = {
      getMetacoinsForUser : function* () { return 3 }
    }
    metacoins.__set__('metacoins', metacoinsServiceStub)

    // Create test message options
    let options = {
      message : {
        author  : { id: 1 },
        channel : {
          sendMessage : function* (message) {
            return message
          }
        }
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(options.message.channel, 'sendMessage')

    yield metacoins.message(options)

    sendMessageSpy.callCount.should.eql(1)
    sendMessageSpy.lastCall.args[0].should.eql('3')

    // Restore stub
    metacoins.__set__('metacoins', metacoinsService)

  })


  it('responds with a leaderboard for an admin user', function* () {

    // Rewire the metacoins service with a stub for the leaderboard function
    let metacoinsService = metacoins.__get__('metacoins')
    let metacoinsServiceStub = {
      getLeaderboard: function* () { return 'leaderboard' }
    }
    metacoins.__set__('metacoins', metacoinsServiceStub)

    // Create test message options
    let options = {
      args    : [METACOINS.COMMANDS.LEADERBOARD],
      message : {
        author  : { id: METACOINS.ADMIN_USER_ID },
        channel : {
          sendMessage : function* (message) {
            return message
          }
        }
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(options.message.channel, 'sendMessage')

    yield metacoins.message(options)

    sendMessageSpy.callCount.should.eql(1)
    sendMessageSpy.lastCall.args[0].should.eql('leaderboard')

    // Restore stub
    metacoins.__set__('metacoins', metacoinsService)

  })

})
