<?php

$con = mysqli_connect('localhost','root', '', 'mydrive_db');

function get_icon($type, $ext = null)
{

	$icons = [

		'image/jpeg' => '<i class="bi bi-card-image class_39"></i>',
		'audio/mpeg' => '<i class="bi bi-soundwave class_39"></i>',
		'video/x-matroska' => '<i class="bi bi-film class_31"></i>',
		'video/mp4' => '<i class="bi bi-film class_31"></i>',
		'folder' => '<i class="bi bi-folder class_39"></i>',
		'application/octet-stream' => [
			'psd'=>'<i class="bi bi-filetype-psd class_39"></i>',
			'pdf'=>'<i class="bi bi-earmark-pdf-fill class_39"></i>',
			'sql'=>'<i class="bi bi-filetype-sql class_39"></i>',
		],
		'text/plain' => '<i class="bi bi-filetype-txt class_39"></i>',
		'application/vnd.openxmlformats-officedocument.word' => '<i class="bi bi-file-earmark-word class_40"></i>',
	];

	if($type == 'application/octet-stream')
	{
		return $icons[$type][$ext] ?? '<i class="bi bi-question-square-fill class_39"></i>';
	}

	return $icons[$type] ?? '<i class="bi bi-question-square-fill class_39"></i>';

}

function query($query)
{
	global $con;

	$result = mysqli_query($con, $query);
	if($result)
	{
		if(!is_bool($result) && mysqli_num_rows($result) > 0)
		{
			$res = [];
			while ($row = mysqli_fetch_assoc($result)) {
				$res[] = $row;
			}

			return $res;
		}
	}

	return false;
}

function query_row($query)
{
	global $con;

	$result = mysqli_query($con, $query);
	if($result)
	{
		if(!is_bool($result) && mysqli_num_rows($result) > 0)
		{
			/*
			$res = [];
			while ($row = mysqli_fetch_assoc($result)) {
				$res[] = $row;
			}

			return $res[0];
			*/
			return mysqli_fetch_assoc($result);
		}
	}

	return false;
}

function get_date($date)
{
	return date("jS M Y",strtotime($date));
}


function is_logged_in(){

	if(!empty($_SESSION['MY_DRIVE_USER']) && is_array($_SESSION['MY_DRIVE_USER']))
		return true;

	return false;
}

function get_drive_space($user_id)
{
	$query = "select sum(file_size) as sum from mydrive where user_id = '$user_id'";
	$row = query($query);
	if($row){
		return $row[0]['sum'];
	}

	return 0;
}


function generate_slug()
{
	$str = "";

	$a = range(0, 9);
	$b = range('a', 'z');
	$c = range('A', 'Z');

	$array = array_merge($a,$b,$c);
	$array[] = '_';
	$array[] = '-';

	$array_length = count($array) - 1;
	$str_length = rand(10,50);

	for ($i=0; $i < $str_length; $i++) { 
		$key = rand(0,$array_length);
		$str .= $array[$key];
	}
	return $str;
}


$human_readable_file_types = [

	'application/vnd.openxmlformats-officedocument.word' => 'Word document',
	'text/plain' => 'Plain Text',
	'video/mp4' => 'Mp4 Video',
	'audio/mpeg' => 'Mp3 Audio',
	'image/jpeg' => 'Image',
	'image/png' => 'Image',
	'image/webp' => 'Image',
	'video/x-matroska' => 'Mkv Video',

];

function check_file_access($row)
{
	$user_id = $_SESSION['MY_DRIVE_USER']['id'] ?? 0;
	$myemail = $_SESSION['MY_DRIVE_USER']['email'] ?? 0;

	switch ($row['share_mode']) {
		case 0:
			// private
			if($row['user_id'] == $user_id)
			{
				return true;
			}

			break;
		case 1:
			
			// shared to specific users
			$query = "select * from shared_to where file_id = '$row[id]' && disabled = 0";
			$emails = query($query);
			if($emails)
			{
				if($user_id == $row['user_id'])
				{
					return true;
				}else{
					
					$email_list = array_column($emails, 'email');
					if(in_array($myemail, $email_list))
					{
						return true;
					}
				}
			}else{
				//only allow the owner
				if($user_id == $row['user_id'])
				{
					return true;
				}
			}

			break;
		case 2:
			// shared to the public
			return true;
			break;
		
		default:
			return false;
			break;
	}

	return false;
}