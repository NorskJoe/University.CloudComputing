<!DOCTYPE html>
<html>
    <body>
        <!--
        First create the data.txt file with first 10 prime numbers
        Code edited from lab2 worksheet
        -->
        <?php
            $data_file = "gs://s3542413-assignment/assignment/data.txt";

            $data_handle = fopen($data_file,'w');

            fwrite($data_handle,'2');

            for($i = 3; $i < 30; $i = $i+2)
            {
                $j = 2;
                while($i % $j != 0)
                {
                    if($j > sqrt($i))
                    {
                        fwrite($data_handle,",".$i);
                        break;
                    }
                    $j++;
                }
            }
            fclose($data_handle);
         ?>

         <!--
         Print the values of X and Y after form has been submitted
         Write to results.txt
        -->
        <?php
            if(isset($_POST['submit']))
            {
                $sum = 0;
                $avg = 0;

                $primes = explode(",", file_get_contents($data_file));
                $arrlength=count($primes);

                for($x=0; $x<$arrlength; $x++)
                {
                	$sum += $primes[$x];
                }
                $sum += $_POST['x'];
                $sum += $_POST['y'];
                $arrlength += 2;
                $avg = $sum/$arrlength;

                echo "Sum: ".$sum."<br>";
                echo "Average: ".$avg;


                $results_file = "gs://s3542413-assignment/assignment/results.txt";

                $results_handle = fopen($results_file,'w');
                fwrite($results_handle, "Sum: ".$sum."\n");
                fwrite($results_handle, "Average: ".$avg."\n");
                fclose($results_handle);
            }
         ?>

         <!--
         Code for creating the form with two input fields
        -->
         <form action="/sign" method="post">
             <div>
                 <label for="x">X: </label>
                 <input type="text" id="x" name="x">
             </div>
             <div>
                 <label for="y">Y: </label>
                 <input type="text" id="y" name="y">
             </div>
             <div>
                 <input type="submit" name="submit" value="Submit">
             </div>
         </form>
    </body>
</html>
