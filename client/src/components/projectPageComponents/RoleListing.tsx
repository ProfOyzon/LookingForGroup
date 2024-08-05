import '../styles.css';

//Will return name, positions, & 3 buttons on a single line
//Will also return description accessable via a dropdown menu (accessed via 1 of the buttons)
export const RoleListing = (props) => {
  //editMode - tells when this listing is currently being edited
  let editMode = false;
  //descHidden - tells whether or not the description is visible or not
  let descHidden = true;

  //Opens/Closes the description
  //i - the number index of this listing, used to open/close the correct description
  const toggleDescription = (i) => {
    descHidden = !descHidden;
    if (!editMode) {
      let roleListing = document.getElementById('role-desc-' + i);
      roleListing ? roleListing.classList.toggle('role-list-description') : console.log('cannot find listing');
    } else {
      let roleInput = document.getElementById('role-desc-edit-' + i);
      roleInput ? roleInput.classList.toggle('role-list-desc-input') : console.log('cannot find listing');
    }
  }

  //toggles the editing mode for a listing
  //i - the number index of this listing, used to toggle editing mode on the correct listing
  const toggleEdit = (i) => {
    //toggle editMode
    editMode = !editMode;

    //assign elements to modify
    //listParent - element containing name, amount of positions, & buttons
    //desc - element containing description; descInput - element containing the edit input for description
    let listParent = document.getElementById('role-list-' + i);
    let desc = document.getElementById('role-desc-' + i);
    let descInput = document.getElementById('role-desc-edit-' + i);

    //hide/show different elements inside listParent
    //The below errors are due to typescript. It would take so many different checks to make sure they're not 'undefined', so I'm not doing them.
    listParent.querySelector('.role-list-name').classList.toggle('hide');
    listParent.querySelector('.role-list-num').classList.toggle('hide');
    listParent.querySelector('.role-list-edit').classList.toggle('hide');
    listParent.querySelector('.role-list-name-edit-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-num-edit-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-done-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-delete').classList.toggle('hide');

    //Only modifies description displays if the description dropdown is open
    if (!descHidden) {
      desc ? desc.classList.toggle('role-list-description') : console.log('cannot find listing');
      descInput ? descInput.classList.toggle('role-list-desc-input') : console.log('cannot find listing');
    }
  }

  //Removes a role from the list & adjusts display to cover said role
  //Reveals an 'undo' button that undoes this
  const removeRole = (roleIndex) => {
    if(!descHidden) {
      let desc = document.getElementById('role-desc-' + roleIndex);
      desc ? desc.classList.toggle('role-list-description') : console.log('cannot find listing');
      descHidden = true;
    }
    let cover = document.getElementById('role-cover-' + roleIndex);
    cover ? cover.classList.toggle('role-cover') : console.log('error');
    props.removeRole(roleIndex);
  }

  //Undoes a role deletion & reverts display
  const undoRemoveRole = (roleIndex) => {
    let cover = document.getElementById('role-cover-' + roleIndex);
    cover ? cover.classList.toggle('role-cover') : console.log('error');
    props.undoRemoveRole(roleIndex);
  }

  //Called when a 'done' button is pressed, saves any changes made to a role's info based on inputs
  //Changes are not finalized until 'save changes' is pressed & window is subsequently closed
  //Again, errors here are due to typescript. code still functions as intended.
  const doneEdit = (roleIndex) => {
    let listParent = document.getElementById('role-list-' + roleIndex);

    //contains the name, number of positions, & description of edited inputs
    let roleName, roleNum, roleDesc;
    roleName = listParent.querySelector('.role-list-name-edit-hide').value;
    roleNum = listParent.querySelector('.role-list-num-edit-hide').value;
    roleDesc = document.getElementById('role-desc-edit-' + roleIndex).value;

    //Check to make sure all fields have a value to use, stops function if they don't
    if (roleName === '' || roleNum === '' || roleDesc === '') {
      console.log('all fields must have an appropriate input (display this on interface later)');
      return;
    }

    //Update displays with new info
    listParent.querySelector('.role-list-name').innerHTML = roleName;
    listParent.querySelector('.role-list-num').innerHTML = roleNum;
    document.getElementById('role-desc-' + roleIndex).innerHTML = roleDesc;

    //Creates a roleObject to replace the current role data
    let roleObject: {Role: string, amount: number, description: string} =
      {Role: roleName, amount: roleNum, description: roleDesc};

    //Disables editing mode
    toggleEdit(roleIndex);

    props.updateRoleSettings(roleIndex, roleObject);
  }
  
  //Check to make sure the role data being passed in exists
  //If this triggers, something's wrong elsewhere here or in Project.tsx
  if (props.role === undefined || props.role === null) {
    console.log('could not find role');
    return;
  }

  return(
    <>
    <div id={'role-cover-' + props.num} className='hide'>
      Role Removed <button onClick={() => undoRemoveRole(props.num)}>undo</button>
    </div>
    <div id={'role-list-' + props.num} className='role-list-info'>
      <span className='role-list-name'>{props.role.Role}</span>
      <input type='text' className='role-list-name-edit-hide' defaultValue={props.role.Role}/>
      <span className='role-list-num'>{props.role.amount}</span>
      <input type='number' className='role-list-num-edit-hide' defaultValue={props.role.amount}/>
      <button className='role-list-desc-dropdown' onClick={() => toggleDescription(props.num)}>V</button>
      <button className='role-list-edit' onClick={() => toggleEdit(props.num)}>edit</button>
      <button className='role-list-done-hide' onClick={() => doneEdit(props.num)}>done</button>
      <button className='role-list-delete' onClick={() => removeRole(props.num)}>X</button>
    </div>
    <div id={'role-desc-' + props.num} className='hide'>
      {props.role.description}
    </div>
    <textarea id={'role-desc-edit-' + props.num} className='hide' defaultValue={props.role.description}/>
    </>
  )
}