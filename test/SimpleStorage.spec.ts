import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { assert, expect } from "chai";
import { SimpleStorage } from "../typechain-types";
import type { Signer } from "ethers";

describe.only("Simple Storage Unit Tests", function(){
    // fixtures (to be executed only once no matter how many times I execute the test file)
    async function deploySimpleStorageFixture() {
        const _message = "Test Contract Message";

        const [owner, otherAccount] = await ethers.getSigners();

        const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        const simpleStorage = await SimpleStorageFactory.connect(owner).deploy(_message);

        return {simpleStorage, _message, owner, otherAccount}

    }
    
    it("Should deploy the contract and set message", async function() {
        const { simpleStorage, _message, owner} = await loadFixture(deploySimpleStorageFixture);
    
        const message = await simpleStorage.message();
        assert(message === _message, "Messages are not the same"); //test if message is set correctly
        
        const currentOwner = await simpleStorage.owner();
        assert( currentOwner === owner.address, "Owner was not set properly"); //test if owner is set correctly
    });

    describe("Set messages test", function() {
        let simpleStorageContract: SimpleStorage;
        let user: Signer;
        let contractOwner: Signer;

        //executes once to initialize variables to be used in all the it statements
        this.beforeEach(async function() {
            const {simpleStorage, otherAccount, owner} = await loadFixture(deploySimpleStorageFixture);
            simpleStorageContract = simpleStorage;
            user = otherAccount;
            contractOwner = owner;
        })

        it("Should be called only by owner", async function() {
            //transaction should not go trough with an account that is not the owner
            await expect(
                simpleStorageContract
                    .connect(user)
                    .setMessage("New Message")
            ).to.be.revertedWith("Error: Only the owner can call this method"); 
        });

        it ("Should set new message", async function() {       
            const newMessage = "New Message from Test";

            await simpleStorageContract.connect(contractOwner).setMessage(newMessage);

            const currentMessage = await simpleStorageContract.message();

            assert(currentMessage === newMessage, "Message was not set correctly");

        });

        it("Should emit a NewMessage event", async function() {
            const newMessage = "Message for event";

            await expect(
                simpleStorageContract
                    .connect(contractOwner)
                    .setMessage(newMessage))
                .to.emit(simpleStorageContract, "NewMessage")
                .withArgs(newMessage)
        });
    }) 

})
